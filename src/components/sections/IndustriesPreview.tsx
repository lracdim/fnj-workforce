import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const featured = [
  {
    name: 'Healthcare',
    desc: 'Connecting hospitals and clinics with qualified nurses, CNAs, and caregivers.',
    img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Hospitality',
    desc: 'Staffing hotels, restaurants, and events with reliable, guest-ready talent.',
    img: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Information Technology',
    desc: "Placing developers, analysts, and support specialists where they're needed most.",
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
  },
];

export default function IndustriesPreview() {
  return (
    <section className="w-full bg-cream py-28 px-6 md:px-14">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-14 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-gold font-bold mb-4 block">
              Where We Place Talent
            </span>
            <h2 className="font-display font-extrabold text-4xl lg:text-5xl text-ink">
              Nine Industries. <br className="hidden sm:block" /> One Standard of Excellence.
            </h2>
          </div>
          <Link to="/industries" className="flex items-center gap-2 text-forest font-semibold text-sm whitespace-nowrap group">
            View All Industries
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="group rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-shadow duration-400"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                <h3 className="absolute bottom-4 left-5 text-white text-2xl font-display font-bold">
                  {item.name}
                </h3>
              </div>
              <div className="p-6">
                <p className="text-sm text-ink/60 leading-relaxed mb-4">{item.desc}</p>
                <Link to="/industries" className="text-forest text-sm font-semibold inline-flex items-center gap-1.5 group/link">
                  Explore
                  <ArrowRight size={14} className="transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

