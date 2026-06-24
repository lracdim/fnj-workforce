import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, X } from 'lucide-react';

export default function VideoFeature() {
  const [open, setOpen] = useState(false);

  return (
    <section className="w-full bg-ink py-28 px-6 md:px-14 
                        relative overflow-hidden">
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <span className="text-xs uppercase tracking-[0.2em] 
                        text-gold font-bold mb-4 block">
          See Us in Action
        </span>
        <h2 className="font-display font-extrabold text-4xl 
                      lg:text-5xl text-cream mb-6 leading-tight">
          Meet the People Behind<br />F&J WorkForce
        </h2>
        <p className="text-cream/60 text-lg max-w-xl mx-auto mb-12">
          A two-minute look at how we work, who we are, and 
          why businesses trust us to bring the right talent 
          through their door.
        </p>

        <motion.button
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          onClick={() => setOpen(true)}
          className="group relative w-full max-w-3xl mx-auto 
                    aspect-video rounded-3xl overflow-hidden 
                    shadow-2xl block"
        >
          <img
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80"
            alt="F&J WorkForce team"
            className="w-full h-full object-cover 
                      group-hover:scale-105 transition-transform 
                      duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t 
                          from-ink/70 via-ink/20 to-transparent" />
          <div className="absolute inset-0 flex items-center 
                          justify-center">
            <div className="w-20 h-20 rounded-full bg-gold 
                            flex items-center justify-center 
                            shadow-xl group-hover:scale-110 
                            transition-transform duration-300">
              <Play size={26} className="text-ink ml-1" 
                    fill="currentColor" />
            </div>
          </div>
          <div className="absolute bottom-6 left-6 right-6 text-center">
            <p className="text-cream font-semibold text-sm">
              Watch: Who We Are at F&J
            </p>
            <p className="text-cream/60 text-xs mt-0.5">
              2:14 min
            </p>
          </div>
        </motion.button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[200] bg-ink/95 backdrop-blur-sm 
                    flex items-center justify-center p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="w-full max-w-4xl aspect-video bg-ink 
                          rounded-2xl overflow-hidden relative">
            <video
              controls
              autoPlay
              poster="/video-poster.jpg"
              className="w-full h-full object-cover"
            >
              <source src="/videos/fnj-intro-placeholder.mp4" type="video/mp4" />
            </video>
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full 
                        bg-cream/10 text-cream flex items-center 
                        justify-center hover:bg-cream/20"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}