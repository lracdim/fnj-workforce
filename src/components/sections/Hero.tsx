import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, ArrowRight } from 'lucide-react';
import { useContactModal } from '../../context/ContactModalContext';

export default function Hero() {
  const { openModal } = useContactModal();
  return (
    <section
      className="relative w-full min-h-screen pt-32 pb-20 px-6 md:px-14 bg-cream overflow-hidden"
    >
      <div
        className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center"
      >
        <div className="lg:col-span-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 mb-7"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            <span className="text-[12px] uppercase tracking-[0.16em] text-forest font-bold">
              Rio Vista, California — Staffing Partner
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-extrabold text-ink text-[42px] sm:text-[58px] lg:text-[72px] leading-[0.98] tracking-[-0.03em] mb-6"
          >
            We connect{' '}
            <span className="accent-italic text-gold">talent</span>
            {' '}with{' '}
            <span className="accent-italic text-forest">opportunity</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="font-sans font-medium text-[18px] text-ink/70 max-w-[420px] leading-[1.5] mb-9"
          >
            We place the right people in the right roles — across healthcare, hospitality, technology, and seven more industries. Fast, careful, and built to last.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="flex flex-wrap items-center gap-2 mb-9"
          >
            <button
              onClick={openModal}
              className="group flex items-center gap-2 px-8 py-4 bg-forest text-cream rounded-full text-sm font-bold uppercase tracking-wide shadow-lg shadow-forest/20 hover:bg-forest-dark hover:shadow-xl hover:shadow-forest/25 transition-all duration-300"
            >
              Find Talent
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
            <Link
              to="/services"
              className="flex items-center gap-2 px-8 py-4 text-ink/70 rounded-full text-sm font-semibold uppercase tracking-wide hover:text-forest transition-colors duration-300"
            >
              Browse Opportunities
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
            className="pt-6 border-t border-ink/8 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-ink/45 uppercase tracking-[0.08em] font-semibold"
          >
            <span>9 Industries Served</span>
            <span className="text-gold">·</span>
            <span>Rio Vista, CA HQ</span>
            <span className="text-gold">·</span>
            <span>People-First Staffing</span>
          </motion.div>
        </div>

        <div
          className="lg:col-span-6 relative h-[420px] sm:h-[520px] lg:h-[560px]"
        >
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-0 right-0 w-[78%] h-[85%] rounded-[28px] overflow-hidden"
          >
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=900&q=80"
              alt="Professional at work"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-0 left-0 w-[52%] h-[44%] rounded-[20px] overflow-hidden border-4 border-cream shadow-2xl"
          >
            <img
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=700&q=80"
              alt="Team collaborating"
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="absolute top-8 left-0 bg-ink text-cream rounded-2xl px-6 py-5 shadow-xl max-w-[180px]"
          >
            <p className="font-display font-extrabold text-3xl text-gold leading-none mb-1">9</p>
            <p className="text-xs text-cream/70 leading-snug">Industries served with dedicated expertise</p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            onClick={() => {
              const modal = document.getElementById('video-modal');
              modal?.classList.remove('hidden');
            }}
            className="absolute bottom-6 right-0 w-[200px] sm:w-[210px] bg-white rounded-2xl shadow-2xl overflow-hidden group cursor-pointer border border-ink/5"
          >
            <div className="relative aspect-video bg-ink flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=500&q=60"
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-50"
              />
              <div className="relative w-11 h-11 rounded-full bg-gold flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play size={16} className="text-ink ml-0.5" fill="currentColor" />
              </div>
            </div>
            <div className="px-4 py-3 text-left">
              <p className="text-[10px] uppercase tracking-wide text-gold-dark font-bold mb-0.5">Watch</p>
              <p className="text-ink text-xs font-semibold">Who We Are at F&J</p>
            </div>
          </motion.button>
        </div>
      </div>

      <div
        id="video-modal"
        className="hidden fixed inset-0 z-[200] bg-ink/90 backdrop-blur-sm items-center justify-center p-6"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            e.currentTarget.classList.add('hidden');
          }
        }}
      >
        <div className="w-full max-w-3xl aspect-video bg-ink rounded-2xl overflow-hidden relative">
          <video
            controls
            poster="/video-poster.jpg"
            className="w-full h-full object-cover"
          >
            <source
              src="/videos/fnj-intro-placeholder.mp4"
              type="video/mp4"
            />
          </video>
          <button
            onClick={() => document.getElementById('video-modal')?.classList.add('hidden')}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-cream/10 text-cream flex items-center justify-center hover:bg-cream/20"
          >
            ✕
          </button>
        </div>
      </div>
    </section>
  );
}

