// Real-Time Order Service supporting BroadcastChannel, LocalStorage, and Firebase Sync

const STORAGE_KEY = 'slowpour_orders';
const CHANNEL_NAME = 'slowpour_realtime_orders';

// Initial sample orders for barista dashboard demonstration if empty
const INITIAL_DEMO_ORDERS = [
  {
    id: 'ORD-7821',
    tableNumber: 4,
    items: [
      {
        id: 4,
        name: 'Latte',
        size: 'Large',
        price: 270,
        quantity: 2,
        customizations: { milk: 'Oat Milk (+₹40)', extras: ['Extra Shot (+₹50)'], note: 'Extra hot please' },
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
    createdAt: new Date(Date.now() - 6 * 60 * 1000).toISOString(), // 6 mins ago
    estimatedTime: 10,
  },
  {
    id: 'ORD-7822',
    tableNumber: 2,
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
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 mins ago
    estimatedTime: 8,
  },
];

class OrderService {
  constructor() {
    this.channel = null;
    this.listeners = new Set();
    if (typeof window !== 'undefined') {
      try {
        this.channel = new BroadcastChannel(CHANNEL_NAME);
        this.channel.onmessage = (event) => {
          this.notifyListeners(event.data);
        };
      } catch {
        // Fallback for environments without BroadcastChannel
      }

      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) {
          this.notifyListeners(this.getOrders());
        }
      });
    }
  }

  getOrders() {
    try {
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

  saveOrders(orders) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
      if (this.channel) {
        this.channel.postMessage(orders);
      }
      this.notifyListeners(orders);
    } catch (e) {
      console.error('Failed to save orders:', e);
    }
  }

  createOrder({ tableNumber, items, subtotal, tax, total, paymentMethod, customerName = '' }) {
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
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

    const orders = [newOrder, ...this.getOrders()];
    this.saveOrders(orders);
    return newOrder;
  }

  getOrderById(id) {
    const orders = this.getOrders();
    return orders.find((o) => o.id === id) || null;
  }

  updateOrderStatus(id, newStatus, paymentStatus = null) {
    const orders = this.getOrders().map((order) => {
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
    this.saveOrders(orders);
  }

  subscribe(callback) {
    this.listeners.add(callback);
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
