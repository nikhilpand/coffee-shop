import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function IconInstagram() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function IconX() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
      <path d="M4 20l6.768 -6.768m2.46 -2.46L20 4" />
    </svg>
  );
}

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-espresso text-ivory/80">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="font-display text-2xl font-semibold text-ivory mb-3">Slow Pour</h3>
            <p className="text-sm leading-relaxed text-ivory/50 mb-6 max-w-xs">
              Coffee, slowly made. Thoughtfully brewed coffee, warm pastries and little moments worth staying for.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full border border-ivory/15 hover:border-ivory/30 hover:bg-ivory/5 transition-all icon-shine"
                aria-label="Instagram"
              >
                <IconInstagram />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full border border-ivory/15 hover:border-ivory/30 hover:bg-ivory/5 transition-all icon-shine"
                aria-label="Facebook"
              >
                <IconFacebook />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full border border-ivory/15 hover:border-ivory/30 hover:bg-ivory/5 transition-all icon-shine"
                aria-label="X (Twitter)"
              >
                <IconX />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-medium tracking-[0.2em] uppercase text-ivory/40 mb-5">Navigate</h4>
            <div className="space-y-3">
              <Link to="/menu" className="block text-sm hover:text-ivory transition-colors">Menu</Link>
              <Link to="/about" className="block text-sm hover:text-ivory transition-colors">About</Link>
              <Link to="/favorites" className="block text-sm hover:text-ivory transition-colors">Favorites</Link>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-xs font-medium tracking-[0.2em] uppercase text-ivory/40 mb-5">Hours</h4>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-ivory/60">Monday – Friday</p>
                <p className="text-ivory">8:00 AM – 9:00 PM</p>
              </div>
              <div>
                <p className="text-ivory/60">Saturday – Sunday</p>
                <p className="text-ivory">9:00 AM – 10:00 PM</p>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-medium tracking-[0.2em] uppercase text-ivory/40 mb-5">Stay in the loop</h4>
            <p className="text-sm text-ivory/50 mb-4">Updates on new blends, seasonal pastries and quiet café moments.</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-4 py-2.5 bg-ivory/5 border border-ivory/10 rounded-full text-sm text-ivory placeholder-ivory/30 focus:outline-none focus:border-ivory/25 transition-colors"
                aria-label="Email for newsletter"
                required
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-ivory text-espresso text-sm font-medium rounded-full hover:bg-cream transition-colors"
              >
                {subscribed ? '✓' : 'Join'}
              </button>
            </form>
            {subscribed && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-caramel mt-2"
              >
                Welcome to the slow pour community.
              </motion.p>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-ivory/10 text-center">
          <p className="text-xs text-ivory/30">
            © {new Date().getFullYear()} Slow Pour. Crafted with care.
          </p>
        </div>
      </div>
    </footer>
  );
}
