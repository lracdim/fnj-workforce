import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// TODO: Replace with real F&J client testimonials before launch
const testimonials = [
  {
    quote:
      "F&J found us three qualified nurses within two weeks. Their understanding of healthcare staffing requirements saved us months of searching.",
    name: 'Placeholder Name',
    title: 'HR Director, Regional Medical Group',
  },
  {
    quote:
      'What sets F&J apart is how invested they are in getting the fit right — not just filling a seat. Every placement has worked out.',
    name: 'Placeholder Name',
    title: 'Operations Manager, Hospitality Group',
  },
  {
    quote:
      'Responsive, professional, and genuinely good people to work with. F&J became an extension of our hiring team.',
    name: 'Placeholder Name',
    title: 'Founder, Logistics Company',
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => (i + 1) % testimonials.length);
  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="w-full bg-cream py-28 px-6 md:px-14">
      <div className="max-w-3xl mx-auto text-center">
        <span className="text-xs uppercase tracking-[0.2em] text-gold font-bold mb-4 block">
          Testimonials
        </span>
        <h2 className="font-display font-extrabold text-4xl text-ink mb-14">Voices of Trust</h2>

        <div className="relative min-h-[220px] flex items-center justify-center">
          <span className="absolute -top-4 accent-italic text-gold/20 text-8xl leading-none select-none">"</span>
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="relative z-10"
            >
              <p className="accent-italic text-2xl text-ink leading-relaxed mb-8">
                {testimonials[index].quote}
              </p>
              <div className="w-10 h-[2px] bg-forest mx-auto mb-3" />
              <p className="font-semibold text-ink text-sm">{testimonials[index].name}</p>
              <p className="text-ink/50 text-xs">{testimonials[index].title}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-6 mt-10">
          <button
            onClick={prev}
            className="w-9 h-9 rounded-full border border-ink/15 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-2 h-2 rounded-full transition-colors ${i === index ? 'bg-gold' : 'bg-ink/15'}`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="w-9 h-9 rounded-full border border-ink/15 flex items-center justify-center hover:border-gold hover:text-gold transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

