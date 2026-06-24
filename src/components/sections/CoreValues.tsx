import { motion } from 'framer-motion';
import { Users, ShieldCheck, Eye, TrendingUp, Handshake } from 'lucide-react';

const values = [
  {
    num: '01',
    icon: Users,
    title: 'Client-Centric Approach',
    body: "We put our clients' needs at the center of everything we do and deliver tailored solutions that exceed expectations.",
    tall: true,
  },
  {
    num: '02',
    icon: ShieldCheck,
    title: 'Integrity & Professionalism',
    body: 'We conduct our business with the highest standards of integrity, ethics, and professionalism.',
    tall: false,
  },
  {
    num: '03',
    icon: Eye,
    title: 'Respect for Diversity',
    body: 'We value and respect the diversity of our clients and candidates and promote an inclusive environment.',
    tall: false,
  },
  {
    num: '04',
    icon: ShieldCheck,
    title: 'Accountability & Transparency',
    body: 'We take full responsibility for our actions and deliver on our promises with transparency.',
    tall: true,
  },
  {
    num: '05',
    icon: TrendingUp,
    title: 'Continuous Improvement',
    body: 'We continuously strive to improve our services, processes, and technologies.',
    tall: false,
  },
  {
    num: '06',
    icon: Handshake,
    title: 'Teamwork & Collaboration',
    body: 'We foster a culture of teamwork, collaboration, and mutual support across every relationship.',
    tall: false,
  },
];

export default function CoreValues() {
  return (
    <section className="w-full bg-white py-28 px-6 md:px-14">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-gold font-bold mb-4 block">
            Core Values
          </span>
          <h2 className="font-display font-extrabold text-4xl lg:text-5xl text-ink">
            The Principles That Guide Us
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={v.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                className={`relative bg-cream rounded-2xl p-8 hover:border-gold border-2 border-transparent hover:-translate-y-1 transition-all duration-300 ${
                  v.tall ? 'sm:py-12' : ''
                }`}
              >
                <span className="absolute top-4 right-6 font-display font-extrabold text-5xl text-gold/15">
                  {v.num}
                </span>
                <Icon size={28} className="text-forest mb-5" />
                <h3 className="text-lg font-bold text-ink mb-3">{v.title}</h3>
                <p className="text-sm text-ink/60 leading-relaxed">{v.body}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

