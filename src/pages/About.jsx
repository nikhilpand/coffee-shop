import { motion } from 'framer-motion';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7 },
};

const timeline = [
  { year: '2019', title: 'The First Cup', text: 'A small idea in a cramped kitchen — what if coffee could be slower, better, more intentional?' },
  { year: '2020', title: 'Finding the Beans', text: 'We traveled to Chikmagalur and found farms that cared about their coffee as much as we did.' },
  { year: '2021', title: 'The First Shop', text: 'A quiet corner in Koramangala. Six tables, one espresso machine, and a lot of hope.' },
  { year: '2023', title: 'Growing Slowly', text: 'More people found us. We added pastries, expanded the menu, and stayed true to the slow way.' },
];

export default function About() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="pt-24 md:pt-32 pb-20"
    >
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 mb-20 md:mb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div {...fadeUp}>
            <p className="text-xs font-medium tracking-[0.25em] uppercase text-caramel mb-4">
              Our Story
            </p>
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold text-espresso leading-[1.08] tracking-tight mb-6">
              We believe coffee<br />deserves a little<br />
              <span className="italic font-normal">more time.</span>
            </h1>
            <p className="text-warm-gray leading-relaxed max-w-md text-base md:text-lg">
              Slow Pour started with a simple idea: what if we stopped rushing coffee?
              What if we gave each cup the attention it deserved? That question
              became a café, and that café became a community.
            </p>
          </motion.div>
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }}>
            <div className="rounded-2xl overflow-hidden aspect-[4/5]">
              <img
                src="https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80"
                alt="Warm café atmosphere with natural light"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div {...fadeUp}>
              <p className="text-xs font-medium tracking-[0.25em] uppercase text-caramel mb-4">
                Philosophy
              </p>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-espresso leading-tight mb-6">
                Slow is not lazy.<br />
                <span className="italic font-normal">Slow is deliberate.</span>
              </h2>
              <p className="text-warm-gray leading-relaxed text-base md:text-lg max-w-2xl mx-auto">
                We source beans directly from farms in Karnataka's coffee belt — single-origin,
                shade-grown, and roasted in small batches to honour their natural character.
                Our pastries are baked fresh every morning with real butter, real ingredients,
                and no shortcuts. We believe if you're going to make something, you should
                make it properly.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sourcing */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div {...fadeUp}>
              <div className="rounded-2xl overflow-hidden aspect-[3/4]">
                <img
                  src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80"
                  alt="Coffee beans being carefully sorted"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </motion.div>
            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }}>
              <p className="text-xs font-medium tracking-[0.25em] uppercase text-caramel mb-4">
                Coffee Sourcing
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-espresso leading-tight mb-6">
                From Chikmagalur<br />
                <span className="italic font-normal">to your cup.</span>
              </h2>
              <p className="text-warm-gray leading-relaxed mb-4">
                Our beans come from family farms in the Western Ghats — grown under
                shade canopy at elevation, hand-picked at peak ripeness, and
                sun-dried on raised beds. We roast them weekly in small 12kg batches,
                never darker than necessary.
              </p>
              <p className="text-warm-gray leading-relaxed">
                The result is coffee that tastes of its origin — not of roast.
                Notes of chocolate, citrus, and caramel that come from the bean itself,
                not from burning it.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bakery */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div {...fadeUp} className="order-2 lg:order-1">
              <p className="text-xs font-medium tracking-[0.25em] uppercase text-caramel mb-4">
                From the Bakery
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-espresso leading-tight mb-6">
                Baked fresh,<br />
                <span className="italic font-normal">every morning.</span>
              </h2>
              <p className="text-warm-gray leading-relaxed mb-4">
                Our pastries start before dawn. French butter croissants that take three
                days to laminate. Cinnamon rolls with real Ceylon cinnamon. Muffins
                with actual blueberries, not flavouring.
              </p>
              <p className="text-warm-gray leading-relaxed">
                We don't believe in "good enough." Either it's worth serving, or
                it stays in the kitchen.
              </p>
            </motion.div>
            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }} className="order-1 lg:order-2">
              <div className="rounded-2xl overflow-hidden aspect-[3/4]">
                <img
                  src="https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=800&q=80"
                  alt="Fresh croissants from the bakery"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-5 md:px-8">
          <motion.div {...fadeUp} className="text-center mb-14">
            <p className="text-xs font-medium tracking-[0.25em] uppercase text-caramel mb-3">
              Our Journey
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-espresso">
              How we got here
            </h2>
          </motion.div>

          <div className="space-y-0">
            {timeline.map((item, i) => (
              <motion.div
                key={item.year}
                className="flex gap-6 md:gap-8"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-caramel rounded-full flex-shrink-0 mt-1.5" />
                  {i < timeline.length - 1 && <div className="w-px flex-1 bg-border min-h-[60px]" />}
                </div>
                <div className="pb-10">
                  <p className="text-xs font-medium tracking-[0.15em] uppercase text-caramel mb-1">
                    {item.year}
                  </p>
                  <h3 className="font-display text-xl font-semibold text-espresso mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-warm-gray leading-relaxed">{item.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Atmosphere */}
      <section className="py-16 md:py-24 bg-cream">
        <div className="max-w-4xl mx-auto px-5 md:px-8 text-center">
          <motion.div {...fadeUp}>
            <p className="text-xs font-medium tracking-[0.25em] uppercase text-caramel mb-4">
              The Space
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-espresso leading-tight mb-6">
              Come for the coffee.<br />
              <span className="italic font-normal">Stay for the feeling.</span>
            </h2>
            <p className="text-warm-gray leading-relaxed max-w-2xl mx-auto text-base md:text-lg mb-10">
              Warm wood, natural light, and the quiet hum of conversation. We designed
              Slow Pour to feel like a place you don't want to leave — with deep window
              seats, long communal tables, and corners perfect for reading or working.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {[
              'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80',
              'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600&q=80',
            ].map((src, i) => (
              <motion.div
                key={i}
                className="rounded-2xl overflow-hidden aspect-[4/3]"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <img src={src} alt={`Café interior ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.main>
  );
}
