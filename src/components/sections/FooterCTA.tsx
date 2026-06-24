import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function FooterCTA() {
  return (
    <section className="relative w-full py-28 px-6 md:px-14 overflow-hidden bg-gradient-to-br from-forest via-forest-dark to-ink">
      <motion.svg
        animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -right-20 -top-20 w-[500px] h-[500px] opacity-[0.07] pointer-events-none"
        viewBox="0 0 400 400"
        fill="none"
      >
        <path
          d="M 50 350 C 150 350, 120 200, 220 170 S 320 80, 360 30"
          stroke="#C9A227"
          strokeWidth="4"
        />
      </motion.svg>

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <h2 className="font-display font-extrabold text-4xl lg:text-5xl text-cream mb-6 leading-tight">
          Ready to Bring Talent and<br />Opportunity Together?
        </h2>
        <p className="text-cream/70 text-lg mb-10 max-w-xl mx-auto">
          Whether you're hiring or looking for your next opportunity, F&J WorkForce is ready to help.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            to="/about#contact-form"
            className="flex items-center gap-2 px-8 py-3.5 bg-gold text-ink rounded-full text-sm font-bold uppercase tracking-wide hover:bg-gold-light transition-colors group"
          >
            Hire Talent
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/services"
            className="flex items-center gap-2 px-8 py-3.5 border-2 border-cream/30 text-cream rounded-full text-sm font-bold uppercase tracking-wide hover:border-cream transition-colors"
          >
            Find Opportunities
          </Link>
        </div>
      </div>
    </section>
  );
}

