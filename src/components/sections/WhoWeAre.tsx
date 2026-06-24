import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function WhoWeAre() {
  return (
    <section className="w-full bg-cream py-28 px-6 md:px-14">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-5 relative h-[420px]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="absolute top-0 left-0 w-[72%] h-[68%] rounded-2xl overflow-hidden shadow-xl"
          >
            <img
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=80"
              alt="Team collaborating"
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="absolute bottom-0 right-0 w-[60%] h-[55%] rounded-2xl overflow-hidden shadow-xl border-4 border-cream"
          >
            <img
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80"
              alt="Professional handshake"
              className="w-full h-full object-cover"
            />
          </motion.div>

          <div className="absolute top-[58%] left-[60%] w-10 h-10 rounded-full bg-gold flex items-center justify-center shadow-lg z-10">
            <ArrowRight size={16} className="text-ink -rotate-45" />
          </div>
        </div>

        <div className="lg:col-span-7">
          <span className="text-xs uppercase tracking-[0.2em] text-gold font-bold mb-4 block">
            Who We Are
          </span>
          <h2 className="font-display font-extrabold text-4xl lg:text-5xl text-ink mb-6 leading-tight">
            What We Aspire For
          </h2>
          <p className="text-ink/65 text-lg leading-relaxed mb-8 max-w-xl">
            To be the most trusted and preferred staffing partner, recognized for our commitment to delivering exceptional staffing solutions that drive business success and growth.
          </p>

          <div className="border-l-[3px] border-gold pl-6 mb-8">
            <p className="text-xs uppercase tracking-[0.15em] text-forest font-bold mb-2">Our Mission</p>
            <p className="text-ink/70 leading-relaxed max-w-lg">
              To provide innovative and flexible staffing solutions to businesses of all sizes, enabling them to access the best talent and resources to achieve their goals.
            </p>
          </div>

          <Link to="/about" className="inline-flex items-center gap-2 text-forest font-semibold text-sm group">
            Learn About Our Story
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

