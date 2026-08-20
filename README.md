# ☕ Slow Pour — Premium Modern Coffee Shop

A premium, modern, minimal café web application crafted with **React**, **Vite**, **Tailwind CSS**, and **Framer Motion**.

Designed with an editorial, cozy, boutique café aesthetic (warm ivory, espresso brown, creamy beige, and subtle caramel accents).

---

## ✨ Features

- **☕ Editorial Hero Section**: Smooth scaling photography, typography hierarchy, and a subtle CSS/SVG steam animation.
- **🔍 Real-Time Search Overlay**:
  - Live query filtering across names, categories, descriptions, ingredients, and tags.
  - Search suggestions, recent searches (persisted), and popular searches.
  - Full keyboard accessibility (`Escape` to close).
- **📋 Menu & Dynamic Filtering**:
  - Categories: *Coffee, Cold Coffee, Tea, Pastries, Snacks, Desserts*.
  - Sorting: *Recommended, Price (Low → High), Price (High → Low), Popular*.
  - Smooth animated transitions on category tabs.
- **✨ Product Details**:
  - Large product photography, size/variation selector with price updates, ingredient tags, quantity controls, and related item recommendations.
- **🛒 Functional Cart Drawer**:
  - Slide-in cart drawer with quantity adjustments, item removals, subtotal, 5% estimated tax, and total in Indian Rupees (₹).
  - Demo checkout modal.
  - LocalStorage persistence.
- **🤍 Favorites List**:
  - Heart toggle with micro-animations, persisted in localStorage and accessible from `/favorites`.
- **📖 Brand Story & Philosophy (`/about`)**:
  - Single-origin sourcing story from Chikmagalur, bakery craftsmanship, interactive timeline, and ambience gallery.
- **📱 Fully Responsive**: Custom layouts tailored for mobile, tablet, laptop, and desktop viewports.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router v7](https://reactrouter.com/)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/<your-username>/coffee-shop.git
cd coffee-shop

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be running locally at `http://localhost:5173/` or `http://localhost:5174/`.

### Building for Production

```bash
npm run build
```

---

## 📂 Project Structure

```
src/
├── components/          # Reusable UI components (Navbar, Hero, ProductCard, CartDrawer, etc.)
├── context/             # CartContext & state management
├── data/                # Mock product catalog (24 items), categories, testimonials
├── hooks/               # useSearch, useFavorites
├── pages/               # Home, Menu, Product, About, Favorites
├── utils/               # formatPrice, searchProducts
├── App.jsx              # Main App layout & animated routes
├── main.jsx             # React entry point
└── index.css            # Tailwind theme tokens & custom animations
```
