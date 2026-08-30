// Real-Time Cloud Order Service using Firebase Cloud Firestore with Offline LocalStorage fallback
import { db } from '../firebase';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';

const STORAGE_KEY = 'slowpour_orders';
const CHANNEL_NAME = 'slowpour_realtime_orders';

// ── Rate Limiter ──
const RATE_LIMIT_MAX = 3;       // max orders
const RATE_LIMIT_WINDOW = 60000; // per 60 seconds
const orderTimestamps = [];

function isRateLimited() {
  const now = Date.now();
  // Remove timestamps outside the window
  while (orderTimestamps.length > 0 && now - orderTimestamps[0] > RATE_LIMIT_WINDOW) {
    orderTimestamps.shift();
  }
  return orderTimestamps.length >= RATE_LIMIT_MAX;
}

function recordOrderTimestamp() {
  orderTimestamps.push(Date.now());
}

// ── Input Sanitization ──
function sanitizeText(input, maxLength = 50) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>/g, '')       // Strip HTML tags
    .replace(/[<>"'`]/g, '')       // Remove dangerous chars
    .trim()
    .slice(0, maxLength);
}

class OrderService {
  constructor() {
    this.channel = null;
    this.listeners = new Set();
    this.cachedOrders = this.getLocalOrders();
    this.firestoreUnsubscribe = null;
    this.isFirestoreActive = false;

    if (typeof window !== 'undefined') {
      try {
        this.channel = new BroadcastChannel(CHANNEL_NAME);
        this.channel.onmessage = (event) => {
          if (Array.isArray(event.data)) {
            this.cachedOrders = event.data;
            this.notifyListeners(event.data);
          }
        };
      } catch {
        // Fallback for environments without BroadcastChannel
      }

      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) {
          try {
            const parsed = JSON.parse(e.newValue);
            if (Array.isArray(parsed)) {
              this.cachedOrders = parsed;
              this.notifyListeners(parsed);
            }
          } catch {
            // ignore
          }
        }
      });

      // Initialize real-time Cloud Firestore subscription
      this.initFirestoreListener();
    }
  }

  initFirestoreListener() {
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, orderBy('createdAt', 'desc'));

      this.firestoreUnsubscribe = onSnapshot(
        q,
        (snapshot) => {
          this.isFirestoreActive = true;
          const cloudOrders = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              ...data,
            };
          });

          this.cachedOrders = cloudOrders;
          this.saveLocalOrders(cloudOrders);
          this.notifyListeners(cloudOrders);
        },
        (error) => {
          console.warn('Firestore real-time sync note (using local cache until online):', error.message);
          this.isFirestoreActive = false;
          // Fallback to local cache
          this.notifyListeners(this.cachedOrders);
        }
      );
    } catch (err) {
      console.warn('Firestore initialization fallback:', err);
      this.notifyListeners(this.cachedOrders);
    }
  }

  getLocalOrders() {
    try {
      if (typeof window === 'undefined') return [];
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        // Filter out any old demo orders (ORD-7821, ORD-7822)
        return parsed.filter((o) => o.id !== 'ORD-7821' && o.id !== 'ORD-7822');
      }
      return [];
    } catch {
      return [];
    }
  }

  saveLocalOrders(orders) {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
        if (this.channel) {
          this.channel.postMessage(orders);
        }
      }
    } catch (e) {
      console.error('Failed to write local orders cache:', e);
    }
  }

  getOrders() {
    return this.cachedOrders && this.cachedOrders.length > 0
      ? this.cachedOrders
      : this.getLocalOrders();
  }

  createOrder({ tableNumber, items, subtotal, tax, total, paymentMethod, customerName = '' }) {
    // Rate limit check
    if (isRateLimited()) {
      throw new Error('Too many orders. Please wait a moment before ordering again.');
    }

    // Sanitize inputs
    const safeName = sanitizeText(customerName, 50);

    // Generate unique order ID with retry
    let orderId;
    let retries = 0;
    do {
      orderId = `ORD-${Date.now().toString(36).toUpperCase().slice(-4)}${Math.floor(10 + Math.random() * 90)}`;
      retries++;
    } while (this.getOrderById(orderId) && retries < 3);

    const newOrder = {
      id: orderId,
      tableNumber: Math.max(1, Math.min(24, Number(tableNumber) || 1)),
      customerName: safeName || `Guest (Table ${tableNumber})`,
      items: items.slice(0, 20), // Max 20 items
      subtotal,
      tax,
      total,
      paymentMethod, // 'UPI Online' | 'Pay at Counter'
      paymentStatus: paymentMethod === 'UPI Online' ? 'Paid' : 'Pending',
      status: 'received', // 'received' -> 'preparing' -> 'served'
      createdAt: new Date().toISOString(),
      estimatedTime: Math.min(15, Math.max(6, items.length * 4)),
    };

    // Record for rate limiting
    recordOrderTimestamp();

    // 1. Instant local state update
    const updatedOrders = [newOrder, ...this.getOrders().filter(o => o.id !== orderId)];
    this.cachedOrders = updatedOrders;
    this.saveLocalOrders(updatedOrders);
    this.notifyListeners(updatedOrders);

    // 2. Sync to Firebase Cloud Firestore in background (non-blocking)
    try {
      const orderDocRef = doc(db, 'orders', orderId);
      setDoc(orderDocRef, newOrder).catch((err) => {
        console.warn('Cloud Firestore background sync note:', err.message);
      });
    } catch (err) {
      console.warn('Cloud Firestore dispatch error:', err.message);
    }

    return newOrder;
  }

  async getOrderDoc(id) {
    // 1. Check local cache first
    const found = this.getOrderById(id);
    if (found) return found;

    // 2. Fetch directly from Cloud Firestore with 2s timeout
    try {
      const docRef = doc(db, 'orders', id);
      const fetchPromise = getDoc(docRef);
      const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(null), 2000));
      const snap = await Promise.race([fetchPromise, timeoutPromise]);

      if (snap && snap.exists && snap.exists()) {
        const orderData = { id: snap.id, ...snap.data() };
        // Update cache
        const updated = [orderData, ...this.getOrders().filter((o) => o.id !== id)];
        this.cachedOrders = updated;
        this.saveLocalOrders(updated);
        this.notifyListeners(updated);
        return orderData;
      }
    } catch (err) {
      console.warn('Direct Firestore order fetch error:', err);
    }
    return this.getOrderById(id);
  }

  getOrderById(id) {
    const orders = this.getOrders();
    return orders.find((o) => o.id === id) || null;
  }

  async updateOrderStatus(id, newStatus, paymentStatus = null) {
    // 1. Optimistic local update
    const updatedOrders = this.getOrders().map((order) => {
      if (order.id === id) {
        const updated = {
          ...order,
          status: newStatus,
        };
        if (paymentStatus) {
          updated.paymentStatus = paymentStatus;
        }
        return updated;
      }
      return order;
    });

    this.cachedOrders = updatedOrders;
    this.saveLocalOrders(updatedOrders);
    this.notifyListeners(updatedOrders);

    // 2. Sync update to Firebase Cloud Firestore
    try {
      const orderDocRef = doc(db, 'orders', id);
      const patch = { status: newStatus };
      if (paymentStatus) {
        patch.paymentStatus = paymentStatus;
      }
      await updateDoc(orderDocRef, patch);
    } catch (err) {
      console.error('Cloud Firestore status update sync note:', err);
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    // Immediately emit current cached orders
    callback(this.getOrders());
    return () => {
      this.listeners.delete(callback);
    };
  }

  notifyListeners(orders) {
    this.listeners.forEach((callback) => {
      try {
        callback(orders);
      } catch (err) {
        console.error('Listener callback error:', err);
      }
    });
  }
}

export const orderService = new OrderService();
