import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Hero from '../components/Hero';
import SectionHeading from '../components/SectionHeading';
import ProductCard from '../components/ProductCard';
import products, { testimonials } from '../data/products';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7 },
};

export default function Home({ favorites }) {
  const featured = products.filter((p) => p.popular).slice(0, 4);
  const pastries = products.filter((p) => p.category === 'Pastries').slice(0, 3);

  return (
    <main>
      <Hero />


      {/* ── Featured Coffee ── */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <SectionHeading
            eyebrow="Worth every sip"
            title="Our favourites"
            description="The ones that keep people coming back. Tried, loved, and ordered again."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {featured.map((product, i) => (
              <ProductCard key={product.id} product={product} favorites={favorites} index={i} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 text-sm font-medium text-espresso hover:text-coffee transition-colors group"
            >
              View full menu
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Editorial: Slow Mornings ── */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div {...fadeUp} className="order-2 lg:order-1">
              <p className="text-xs font-medium tracking-[0.25em] uppercase text-caramel mb-4">
                The Slow Pour Way
              </p>
              <h2 className="font-display text-4xl sm:text-5xl md:text-[3.5rem] font-semibold text-espresso leading-[1.1] tracking-tight mb-6">
                Made for<br />
                <span className="italic font-normal">slow mornings.</span>
              </h2>
              <p className="text-warm-gray leading-relaxed max-w-md mb-6">
                We don't believe in rushing coffee. Every cup is pulled with care, steamed
                with patience, and served when it's ready — not before. Some things deserve
                a little more time.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-sm font-medium text-espresso hover:text-coffee transition-colors group"
              >
                Our story
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.15 }}
              className="order-1 lg:order-2"
            >
              <div className="rounded-2xl overflow-hidden aspect-[4/5] lg:aspect-[3/4]">
                <img
                  src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=80"
                  alt="Coffee being carefully poured in warm morning light"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Popular Snacks/Pastries ── */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <SectionHeading
            eyebrow="From the bakery"
            title="Something sweet"
            description="Baked fresh every morning. Best enjoyed warm, with a cup of something slow."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {pastries.map((product, i) => (
              <ProductCard key={product.id} product={product} favorites={favorites} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Editorial: Roasted with Intention ── */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div {...fadeUp}>
              <div className="rounded-2xl overflow-hidden aspect-[4/5] lg:aspect-[3/4]">
                <img
                  src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80"
                  alt="Close-up of freshly roasted coffee beans"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </motion.div>
            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }}>
              <p className="text-xs font-medium tracking-[0.25em] uppercase text-caramel mb-4">
                Single Origin
              </p>
              <h2 className="font-display text-4xl sm:text-5xl md:text-[3.5rem] font-semibold text-espresso leading-[1.1] tracking-tight mb-6">
                Roasted with<br />
                <span className="italic font-normal">intention.</span>
              </h2>
              <p className="text-warm-gray leading-relaxed max-w-md mb-6">
                Our beans are sourced directly from farms in Karnataka and Chikmagalur, roasted
                in small batches to bring out their natural character — never burnt, never rushed,
                always with respect for the origin.
              </p>
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 text-sm font-medium text-espresso hover:text-coffee transition-colors group"
              >
                Explore menu
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Menu Preview ── */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-5 md:px-8 text-center">
          <SectionHeading
            eyebrow="Our Menu"
            title="Good coffee. Something sweet."
            description="Something worth staying for."
          />
          <Link
            to="/menu"
            className="inline-flex items-center px-8 py-3.5 bg-espresso text-ivory text-sm font-medium tracking-wide rounded-full hover:bg-coffee transition-colors duration-300"
          >
            View Full Menu
          </Link>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16 md:py-24 bg-cream overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <SectionHeading eyebrow="Kind words" title="What people say" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {testimonials.map((t, i) => (
              <motion.blockquote
                key={t.id}
                className="bg-ivory rounded-2xl p-7 md:p-9 border border-border/40"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <p className="font-display text-lg md:text-xl text-espresso leading-relaxed italic mb-5">
                  "{t.text}"
                </p>
                <footer className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-cream rounded-full flex items-center justify-center">
                    <span className="font-display text-sm font-semibold text-coffee">
                      {t.author[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-espresso">{t.author}</p>
                    <p className="text-xs text-warm-gray">{t.role}</p>
                  </div>
                </footer>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery Strip ── */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <SectionHeading eyebrow="@slowpour" title="Café moments" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[
              'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&q=80',
              'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80',
              'https://images.unsplash.com/photo-1514066558159-fc8c737ef259?w=400&q=80',
              'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80',
            ].map((src, i) => (
              <motion.div
                key={i}
                className="aspect-square rounded-xl overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <img
                  src={src}
                  alt={`Café moment ${i + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter CTA ── */}
      <section className="py-20 md:py-28 bg-cream">
        <div className="max-w-2xl mx-auto px-5 md:px-8 text-center">
          <motion.div {...fadeUp}>
            <p className="text-xs font-medium tracking-[0.25em] uppercase text-caramel mb-4">
              Stay Connected
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-espresso leading-tight mb-4">
              Join the slow pour<br />
              <span className="italic font-normal">community.</span>
            </h2>
            <p className="text-warm-gray mb-8 max-w-md mx-auto">
              New blends, seasonal pastries, and quiet café moments — delivered to your inbox.
            </p>
            <NewsletterInline />
          </motion.div>
        </div>
      </section>
    </main>
  );
}

function NewsletterInline() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setDone(true);
      setEmail('');
      setTimeout(() => setDone(false), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="flex-1 px-5 py-3.5 bg-white border border-border/60 rounded-full text-sm text-espresso placeholder-warm-gray/50 focus:outline-none focus:border-caramel/40 transition-colors"
        aria-label="Email for newsletter"
      />
      <button
        type="submit"
        className="px-7 py-3.5 bg-espresso text-ivory text-sm font-medium rounded-full hover:bg-coffee transition-colors"
      >
        {done ? 'Subscribed ✓' : 'Subscribe'}
      </button>
    </form>
  );
}
