import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Coffee, Award, Compass, ShieldCheck } from 'lucide-react';
import Hero from '../components/Hero';
import SectionHeading from '../components/SectionHeading';
import ProductCard from '../components/ProductCard';
import CoffeeMatcherModal from '../components/CoffeeMatcherModal';
import LoyaltyStampCard from '../components/LoyaltyStampCard';
import products, { testimonials } from '../data/products';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.65 },
};

export default function Home({ favorites }) {
  const [isMatcherOpen, setIsMatcherOpen] = useState(false);
  const featured = products.filter((p) => p.popular).slice(0, 4);
  const pastries = products.filter((p) => p.category === 'Pastries').slice(0, 3);

  return (
    <main>
      <Hero />

      {/* ── Coffee Matcher Quiz Banner (Psychology: reduces decision fatigue) ── */}
      <section className="py-8 bg-ivory -mt-6 relative z-10">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-cream rounded-3xl p-6 sm:p-8 border border-border/80 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-espresso text-ivory flex items-center justify-center shadow-xs flex-shrink-0">
                <Sparkles size={22} className="text-caramel animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-caramel block mb-0.5">
                  Sensory Taste Profile Matcher
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-espresso">
                  Not sure what to sip today?
                </h3>
                <p className="text-xs text-warm-gray">
                  Answer 3 quick questions to discover your single-origin soulmate.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsMatcherOpen(true)}
              className="w-full md:w-auto px-6 py-3.5 bg-espresso text-ivory hover:bg-coffee text-xs font-semibold rounded-full shadow-xs transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Compass size={15} />
              Find My Perfect Brew
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── Featured Coffee ── */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <SectionHeading
            eyebrow="Signature Roasts"
            title="Handcrafted Favourites"
            description="Roasted in small batches from Chikmagalur estates. Balanced, rich, and unforgettable."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {featured.map((product, i) => (
              <ProductCard key={product.id} product={product} favorites={favorites} index={i} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 text-sm font-semibold text-espresso hover:text-coffee transition-colors group"
            >
              Explore all 24 café items
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Loyalty Rewards Preview Section ── */}
      <section className="py-6 bg-ivory">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <LoyaltyStampCard />
        </div>
      </section>

      {/* ── Editorial: Slow Mornings ── */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div {...fadeUp} className="order-2 lg:order-1">
              <p className="text-xs font-bold tracking-[0.25em] uppercase text-caramel mb-4">
                The Slow Pour Way
              </p>
              <h2 className="font-display text-4xl sm:text-5xl md:text-[3.5rem] font-bold text-espresso leading-[1.1] tracking-tight mb-6">
                Made for<br />
                <span className="italic font-normal">slow mornings.</span>
              </h2>
              <p className="text-warm-gray leading-relaxed max-w-md mb-6 text-sm md:text-base">
                We don&apos;t believe in rushed coffee. Every cup is extracted with precision, micro-foamed
                with organic milk, and served fresh to your table. Some moments deserve
                to be savoured slowly.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/80 p-3.5 rounded-2xl border border-border/60">
                  <span className="font-display text-2xl font-bold text-espresso block mb-0.5">18 hrs</span>
                  <span className="text-[11px] text-warm-gray">Kyoto style cold drip</span>
                </div>
                <div className="bg-white/80 p-3.5 rounded-2xl border border-border/60">
                  <span className="font-display text-2xl font-bold text-espresso block mb-0.5">1,450m</span>
                  <span className="text-[11px] text-warm-gray">Western Ghats elevation</span>
                </div>
              </div>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold text-espresso hover:text-coffee transition-colors group"
              >
                Our story & estates
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
            <motion.div
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: 0.15 }}
              className="order-1 lg:order-2"
            >
              <div className="rounded-3xl overflow-hidden aspect-[4/5] lg:aspect-[3/4] shadow-md border border-border/60">
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
            title="Fresh Hearth Bakes"
            description="27-layer butter croissants, Pain au Chocolat, and brioche rolls baked fresh every morning."
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
              <div className="rounded-3xl overflow-hidden aspect-[4/5] lg:aspect-[3/4] shadow-md border border-border/60">
                <img
                  src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80"
                  alt="Close-up of freshly roasted coffee beans"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </motion.div>
            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }}>
              <p className="text-xs font-bold tracking-[0.25em] uppercase text-caramel mb-4">
                Single Origin Provenance
              </p>
              <h2 className="font-display text-4xl sm:text-5xl md:text-[3.5rem] font-bold text-espresso leading-[1.1] tracking-tight mb-6">
                Roasted with<br />
                <span className="italic font-normal">intention.</span>
              </h2>
              <p className="text-warm-gray leading-relaxed max-w-md mb-6 text-sm md:text-base">
                Our beans are sourced directly from shade-grown farms in Chikmagalur and Baba Budangiri,
                roasted in micro-batches to accentuate their natural floral and chocolate terroir.
              </p>
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 text-sm font-semibold text-espresso hover:text-coffee transition-colors group"
              >
                View full tasting menu
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16 md:py-24 bg-ivory overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <SectionHeading eyebrow="Guest Impressions" title="What table guests say" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {testimonials.map((t, i) => (
              <motion.blockquote
                key={t.id}
                className="bg-white rounded-3xl p-7 md:p-9 border border-border/70 shadow-xs"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <p className="font-display text-lg md:text-xl text-espresso leading-relaxed italic mb-5">
                  &ldquo;{t.text}&rdquo;
                </p>
                <footer className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cream rounded-full flex items-center justify-center">
                    <span className="font-display text-sm font-bold text-coffee">
                      {t.author[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-espresso">{t.author}</p>
                    <p className="text-xs text-warm-gray">{t.role}</p>
                  </div>
                </footer>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* ── Coffee Matcher Modal ── */}
      <CoffeeMatcherModal
        isOpen={isMatcherOpen}
        onClose={() => setIsMatcherOpen(false)}
      />
    </main>
  );
}
