import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const steps = [
  { num: '1', title: 'Understand', body: 'We learn your business, culture, and exact hiring needs.' },
  { num: '2', title: 'Source & Match', body: 'We tap our network to find candidates who truly fit.' },
  { num: '3', title: 'Place & Support', body: 'We support the placement long after day one.' },
];

export default function Process() {
  return (
    <section className="w-full bg-forest py-28 px-6 md:px-14 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <span className="text-xs uppercase tracking-[0.2em] text-gold font-bold mb-4 block">
            Our Process
          </span>
          <h2 className="font-display font-extrabold text-4xl lg:text-5xl text-cream">
            How We Bring Talent and<br />Opportunity Together
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          <svg
            className="hidden md:block absolute top-7 left-[16%] right-[16%] h-16 z-0"
            viewBox="0 0 800 60"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M 0 50 Q 200 50, 400 25 T 800 0"
              stroke="#C9A227"
              strokeWidth="2"
              strokeDasharray="6 8"
              opacity="0.5"
            />
          </svg>

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="relative z-10 text-center md:text-left"
            >
              <div className="w-14 h-14 rounded-full bg-gold flex items-center justify-center text-ink font-display font-extrabold text-xl mx-auto md:mx-0 mb-6">
                {step.num}
              </div>
              <h3 className="text-cream text-xl font-display font-bold mb-3">{step.title}</h3>
              <p className="text-cream/65 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">{step.body}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link
            to="/about#contact-form"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gold text-ink rounded-full text-sm font-bold uppercase tracking-wide hover:bg-gold-light transition-colors group"
          >
            Start Hiring Today
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

