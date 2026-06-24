import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

const faqs = [
  {
    q: 'What industries do you serve?',
    a: 'We place talent across nine industries: Healthcare, Hospitality, Food & Beverage, Information Technology, Manufacturing, Administrative, Construction, Retail, and Transportation.',
  },
  {
    q: 'How quickly can you fill a position?',
    a: 'Timeline depends on role complexity, but our streamlined sourcing process typically presents qualified candidates within days, not weeks.',
  },
  {
    q: 'Do you offer temporary and permanent placement?',
    a: 'Yes — we offer flexible staffing solutions including temporary, temp-to-hire, and direct permanent placement depending on your business needs.',
  },
  {
    q: 'What is your screening process like?',
    a: 'Every candidate goes through skills verification, background checks where applicable, and a thorough interview to ensure cultural and role fit before we present them to you.',
  },
  {
    q: 'How do I get started?',
    a: "Reach out through our contact page or schedule a call. We'll learn about your hiring needs and start matching you with qualified candidates right away.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="w-full bg-cream py-28 px-6 md:px-14">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs uppercase tracking-[0.2em] text-gold font-bold mb-4 block">FAQ</span>
          <h2 className="font-display font-extrabold text-4xl text-ink">Common Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden border border-ink/5">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className="font-semibold text-ink text-base pr-4">{faq.q}</span>
                <motion.div
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0 w-7 h-7 rounded-full bg-gold/10 flex items-center justify-center"
                >
                  <Plus size={14} className="text-gold-dark" />
                </motion.div>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-sm text-ink/60 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

