import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Clock, FileCheck, Users, Shield, 
  ArrowRight, ArrowUpRight, CheckCircle2 
} from 'lucide-react';

const services = [
  {
    title: 'Temporary Staffing',
    icon: Clock,
    img: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1000&q=80',
    desc: 'Need coverage fast? We place qualified temporary staff for short-term projects, seasonal demand, or unexpected gaps — often within days.',
    points: ['Same-week placement available', 'Flexible contract lengths', 'Full payroll & compliance handled by us'],
  },
  {
    title: 'Temp-to-Hire',
    icon: FileCheck,
    img: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=80',
    desc: 'Try before you commit. We place candidates on a trial basis so you can confirm fit before extending a permanent offer.',
    points: ['Risk-free evaluation period', 'Seamless conversion to permanent', 'No long-term obligation upfront'],
  },
  {
    title: 'Direct Hire Placement',
    icon: Users,
    img: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80',
    desc: 'Looking to fill a permanent role the right way? We source, screen, and present candidates ready to join your team for the long haul.',
    points: ['Thorough candidate screening', 'Cultural & skills fit assessment', 'Dedicated recruiter support'],
  },
  {
    title: 'Workforce Compliance & Support',
    icon: Shield,
    img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80',
    desc: "We handle the paperwork so you don't have to — background checks, onboarding compliance, and ongoing placement support.",
    points: ['Background & reference checks', 'Onboarding documentation', 'Post-placement check-ins'],
  },
];

const steps = [
  { num: '01', title: 'Tell Us What You Need', body: 'Share your role requirements, timeline, and culture fit priorities.' },
  { num: '02', title: 'We Source & Screen', body: 'We tap our network and vet candidates against your specific needs.' },
  { num: '03', title: 'You Choose Who Fits', body: 'Review qualified candidates and select who moves forward.' },
  { num: '04', title: 'We Support the Placement', body: 'We stay involved through onboarding and beyond.' },
];

export default function Services() {
  return (
    <div className="bg-cream">

      <section className="relative w-full pt-40 pb-20 px-6 md:px-14 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            <span className="text-[12px] uppercase tracking-[0.16em] text-forest font-bold">
              What We Offer
            </span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-display font-extrabold text-ink text-[40px] sm:text-[56px] leading-[1.02] tracking-[-0.03em] mb-6"
          >
            Staffing solutions built{' '}
            <span className="accent-italic text-gold">around you</span>.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-ink/65 text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Whether you need someone tomorrow or you're building a long-term team, we have a service model that fits.
          </motion.p>
        </div>
      </section>

      {services.map((s, i) => {
        const Icon = s.icon;
        const reversed = i % 2 === 1;
        return (
          <section
            key={s.title}
            className={`w-full py-20 px-6 md:px-14 ${i % 2 === 0 ? 'bg-white' : 'bg-cream'}`}
          >
            <div className="max-w-7xl mx-auto">
              <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center ${reversed ? 'lg:[direction:rtl]' : ''}`}>

                <motion.div
                  initial={{ opacity: 0, x: reversed ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.7 }}
                  className="lg:col-span-5 relative [direction:ltr]"
                >
                  <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-xl">
                    <img src={s.img} alt={s.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
                  </div>
                  <div className="absolute -top-5 -right-5 w-14 h-14 rounded-2xl bg-gold flex items-center justify-center shadow-xl">
                    <Icon size={22} className="text-ink" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: reversed ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="lg:col-span-7 [direction:ltr]"
                >
                  <span className="text-xs uppercase tracking-[0.18em] text-gold font-bold mb-4 block">
                    Service {String(i + 1).padStart(2, '0')}
                  </span>
                  <h2 className="font-display font-extrabold text-3xl lg:text-4xl text-ink mb-5">
                    {s.title}
                  </h2>
                  <p className="text-ink/65 text-base leading-relaxed mb-7 max-w-xl">
                    {s.desc}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-start gap-3">
                        <CheckCircle2 size={18} className="text-forest flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-ink/70">{p}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/about#contact-form"
                    className="inline-flex items-center gap-2 text-forest font-semibold text-sm group"
                  >
                    Let's Work Together
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </section>
        );
      })}

      <section className="w-full bg-forest py-28 px-6 md:px-14">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.2em] text-gold font-bold mb-4 block">
              How It Works
            </span>
            <h2 className="font-display font-extrabold text-4xl lg:text-5xl text-cream">
              Simple, From Start to Hire
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
              >
                <span className="font-display font-extrabold text-5xl text-gold/30 block mb-4">
                  {step.num}
                </span>
                <h3 className="text-cream text-lg font-display font-bold mb-2">
                  {step.title}
                </h3>
                <p className="text-cream/60 text-sm leading-relaxed">
                  {step.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-28 px-6 md:px-14 bg-cream">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display font-extrabold text-4xl lg:text-5xl text-ink mb-6">
            Not Sure Which Service Fits?
          </h2>
          <p className="text-ink/65 text-lg mb-10 max-w-xl mx-auto">
            Tell us what you're working with — we'll recommend the right path.
          </p>
          <Link
            to="/about#contact-form"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-forest text-cream rounded-full text-sm font-bold uppercase tracking-wide hover:bg-forest-dark transition-colors group"
          >
            Talk to Us
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  );
}