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

// Initial sample orders for barista demonstration if database is completely new
const INITIAL_DEMO_ORDERS = [
  {
    id: 'ORD-7821',
    tableNumber: 4,
    customerName: 'Rahul',
    items: [
      {
        id: 4,
        name: 'Latte',
        size: 'Large',
        price: 270,
        quantity: 2,
        customizations: { milk: 'Oat Milk (+₹40)', milkLabel: 'Oat Milk', extras: ['Extra Shot (+₹50)'], extrasLabels: ['Extra Shot'], note: 'Extra hot please' },
      },
      {
        id: 16,
        name: 'Butter Croissant',
        size: 'One',
        price: 180,
        quantity: 1,
        customizations: { note: 'Warm before serving' },
      },
    ],
    subtotal: 810,
    tax: 41,
    total: 851,
    paymentMethod: 'UPI Online',
    paymentStatus: 'Paid',
    status: 'preparing', // 'received' | 'preparing' | 'served' | 'cancelled'
    createdAt: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
    estimatedTime: 10,
  },
  {
    id: 'ORD-7822',
    tableNumber: 2,
    customerName: 'Ananya',
    items: [
      {
        id: 10,
        name: 'Cold Brew',
        size: 'Regular',
        price: 260,
        quantity: 1,
        customizations: { milk: 'None', extras: [] },
      },
      {
        id: 23,
        name: 'Chocolate Cake',
        size: 'Slice',
        price: 280,
        quantity: 1,
        customizations: {},
      },
    ],
    subtotal: 540,
    tax: 27,
    total: 567,
    paymentMethod: 'Pay at Counter',
    paymentStatus: 'Pending',
    status: 'received',
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    estimatedTime: 8,
  },
];

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

          if (cloudOrders.length > 0) {
            this.cachedOrders = cloudOrders;
            this.saveLocalOrders(cloudOrders);
            this.notifyListeners(cloudOrders);
          } else {
            // If cloud is empty, seed demo orders into local & notify
            this.notifyListeners(this.cachedOrders.length > 0 ? this.cachedOrders : INITIAL_DEMO_ORDERS);
          }
        },
        (error) => {
          console.warn('Firestore real-time sync note (using local cache until online):', error.message);
          this.isFirestoreActive = false;
          // Fallback seamlessly to local cache
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
      if (typeof window === 'undefined') return INITIAL_DEMO_ORDERS;
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_ORDERS));
        return INITIAL_DEMO_ORDERS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_DEMO_ORDERS;
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

  async createOrder({ tableNumber, items, subtotal, tax, total, paymentMethod, customerName = '' }) {
    const orderId = `ORD-${Date.now().toString(36).toUpperCase().slice(-4)}${Math.floor(10 + Math.random() * 90)}`;
    const newOrder = {
      id: orderId,
      tableNumber: Number(tableNumber) || 1,
      customerName: customerName.trim() || `Guest (Table ${tableNumber})`,
      items,
      subtotal,
      tax,
      total,
      paymentMethod, // 'UPI Online' | 'Pay at Counter'
      paymentStatus: paymentMethod === 'UPI Online' ? 'Paid' : 'Pending',
      status: 'received', // 'received' -> 'preparing' -> 'served'
      createdAt: new Date().toISOString(),
      estimatedTime: Math.min(15, Math.max(6, items.length * 4)),
    };

    // 1. Optimistic local update
    const updatedOrders = [newOrder, ...this.getOrders().filter(o => o.id !== orderId)];
    this.cachedOrders = updatedOrders;
    this.saveLocalOrders(updatedOrders);
    this.notifyListeners(updatedOrders);

    // 2. Sync to Firebase Cloud Firestore
    try {
      const orderDocRef = doc(db, 'orders', orderId);
      await setDoc(orderDocRef, newOrder);
    } catch (err) {
      console.error('Cloud Firestore sync error during order placement:', err);
    }

    return newOrder;
  }

  async getOrderDoc(id) {
    // 1. Check local cache first
    const found = this.getOrderById(id);
    if (found) return found;

    // 2. Fetch directly from Cloud Firestore
    try {
      const docRef = doc(db, 'orders', id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
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
    return null;
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
