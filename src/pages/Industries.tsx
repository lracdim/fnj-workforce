import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  ClipboardList,
  Cpu,
  Factory,
  HardHat,
  Heart,
  ShoppingBag,
  Truck,
  UtensilsCrossed,
} from 'lucide-react';

type Industry = {
  name: string;
  icon: typeof Heart;
  img: string;
  desc: string;
  roles: string[];
};

const industries: Industry[] = [
  {
    name: 'Healthcare',
    icon: Heart,
    img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
    desc: 'We connect hospitals, clinics, and care facilities with qualified nurses, CNAs, medical assistants, and administrative healthcare staff who meet the highest standards of care.',
    roles: ['Registered Nurses', 'CNAs', 'Medical Assistants', 'Healthcare Administrators'],
  },
  {
    name: 'Hospitality',
    icon: Building2,
    img: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1200&q=80',
    desc: 'From front desk to housekeeping to event staff, we place reliable, guest-ready talent that represents your brand the way it deserves.',
    roles: ['Front Desk Staff', 'Housekeeping', 'Event Coordinators', 'Guest Services'],
  },
  {
    name: 'Food & Beverage',
    icon: UtensilsCrossed,
    img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80',
    desc: 'We staff kitchens, dining rooms, and catering operations with dependable food service professionals who keep service moving.',
    roles: ['Line Cooks', 'Servers', 'Kitchen Managers', 'Catering Staff'],
  },
  {
    name: 'Information Technology',
    icon: Cpu,
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    desc: 'We place developers, analysts, IT support specialists, and technical project staff where your business needs them most.',
    roles: ['Developers', 'IT Support', 'Data Analysts', 'Project Coordinators'],
  },
  {
    name: 'Manufacturing',
    icon: Factory,
    img: 'https://images.unsplash.com/photo-1565514020179-026b92b2d70b?auto=format&fit=crop&w=1200&q=80',
    desc: 'We supply reliable production line workers, machine operators, and quality control staff to keep your operations running smoothly.',
    roles: ['Machine Operators', 'Production Workers', 'Quality Control', 'Warehouse Staff'],
  },
  {
    name: 'Administrative',
    icon: ClipboardList,
    img: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=1200&q=80',
    desc: 'From receptionists to executive assistants, we place organized, capable administrative professionals who keep offices running.',
    roles: ['Receptionists', 'Executive Assistants', 'Office Managers', 'Data Entry Specialists'],
  },
  {
    name: 'Construction',
    icon: HardHat,
    img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    desc: 'We connect contractors and builders with skilled tradespeople and general laborers ready to work on schedule and on budget.',
    roles: ['General Laborers', 'Skilled Tradespeople', 'Site Supervisors', 'Equipment Operators'],
  },
  {
    name: 'Retail',
    icon: ShoppingBag,
    img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    desc: 'We staff sales floors, stockrooms, and customer service desks with friendly, reliable retail professionals.',
    roles: ['Sales Associates', 'Cashiers', 'Store Managers', 'Stock Clerks'],
  },
  {
    name: 'Transportation',
    icon: Truck,
    img: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80',
    desc: 'We place licensed drivers, dispatchers, and logistics coordinators who keep goods and people moving on time.',
    roles: ['CDL Drivers', 'Dispatchers', 'Logistics Coordinators', 'Delivery Drivers'],
  },
];

function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const modalAriaId = useMemo(
    () => `modal_${Math.random().toString(16).slice(2)}`,
    []
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={modalAriaId}
        initial={{ opacity: 0, y: 14, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.18 }}
        className="absolute left-1/2 top-1/2 w-[92vw] max-w-xl -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl shadow-2xl p-6 md:p-8"
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <h3
            id={modalAriaId}
            className="font-display font-extrabold text-2xl text-ink leading-tight"
          >
            {title}
          </h3>
          <button
            type="button"
            className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-full border border-ink/10 text-ink/70 hover:text-ink hover:border-ink/20 transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

export default function Industries() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const openModalFor = (industryName: string) => {
    setSelectedIndustry(industryName);
    setSubmitted(false);
    setForm({ name: '', email: '', company: '', message: '' });
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  return (
    <div className="bg-cream">
      {/* ─── PAGE HERO ─── */}
      <section
        className="relative w-full pt-40 pb-20 px-6 md:px-14 overflow-hidden"
      >
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            <span
              className="text-[12px] uppercase tracking-[0.16em] 
                            text-forest font-bold"
            >
              Industries We Serve
            </span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.8 }}
            className="font-display font-extrabold text-ink 
                      text-[40px] sm:text-[56px] leading-[1.02] 
                      tracking-[-0.03em] mb-6"
          >
            Talent placed across{' '}
            <span className="accent-italic text-gold">nine</span>{' '}
            essential industries.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-ink/65 text-lg max-w-2xl mx-auto 
                      leading-relaxed"
          >
            Every industry has different demands. We bring specialized sourcing
            expertise to each one — so you get candidates who are ready to
            contribute from day one.
          </motion.p>
        </div>
      </section>

      {/* ─── INDUSTRY SECTIONS (Alternating Layout) ─── */}
      {industries.map((ind, i) => {
        const Icon = ind.icon;
        const reversed = i % 2 === 1;
        return (
          <section
            key={ind.name}
            className={`w-full py-20 px-6 md:px-14 
                       ${i % 2 === 0 ? 'bg-cream' : 'bg-white'}`}
          >
            <div className="max-w-7xl mx-auto">
              <div
                className={`grid grid-cols-1 lg:grid-cols-12 
                              gap-10 lg:gap-16 items-center
                              ${reversed ? 'lg:[direction:rtl]' : ''}`}
              >
                {/* Image */}
                <motion.div
                  initial={{ opacity: 0, x: reversed ? 30 : -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.7 }}
                  className="lg:col-span-6 relative [direction:ltr]"
                >
                  <div
                    className="relative aspect-[5/4] rounded-3xl 
                                  overflow-hidden shadow-xl"
                  >
                    <img
                      src={ind.img}
                      alt={ind.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t 
                                    from-ink/40 to-transparent" />
                  </div>
                  <div
                    className="absolute -bottom-6 -left-6 w-16 h-16 
                                  rounded-2xl bg-gold flex items-center 
                                  justify-center shadow-xl"
                  >
                    <Icon size={26} className="text-ink" />
                  </div>
                </motion.div>

                {/* Content */}
                <motion.div
                  initial={{ opacity: 0, x: reversed ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="lg:col-span-6 [direction:ltr]"
                >
                  <span
                    className="text-xs uppercase tracking-[0.18em] 
                                   text-gold font-bold mb-4 block"
                  >
                    Industry {String(i + 1).padStart(2, '0')} / 09
                  </span>
                  <h2
                    className="font-display font-extrabold text-3xl 
                                lg:text-4xl text-ink mb-5"
                  >
                    {ind.name}
                  </h2>
                  <p
                    className="text-ink/65 text-base leading-relaxed 
                               mb-7 max-w-lg"
                  >
                    {ind.desc}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {ind.roles.map((role) => (
                      <span
                        key={role}
                        className="px-4 py-2 bg-forest/8 text-forest 
                                  text-xs font-semibold rounded-full 
                                  border border-forest/15"
                      >
                        {role}
                      </span>
                    ))}
                  </div>

                  <Link
                    to="/about#contact-form"
                    onClick={() => openModalFor(ind.name)}
                    className="inline-flex items-center gap-2 
                              text-forest font-semibold text-sm group"
                  >
                    Hire {ind.name} Talent
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>

                  {/* Secondary static link for accessibility/back-compat (hidden visually) */}
                  <div className="sr-only">
                    <Link to="/about#contact-form">About contact form</Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        );
      })}

      {/* ─── CLOSING CTA ─── */}
      <section
        className="relative w-full py-28 px-6 md:px-14 
                          overflow-hidden bg-gradient-to-br 
                          from-forest via-forest-dark to-ink"
      >
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2
            className="font-display font-extrabold text-4xl 
                        lg:text-5xl text-cream mb-6 leading-tight"
          >
            Don't See Your Industry?
          </h2>
          <p className="text-cream/70 text-lg mb-10 max-w-xl mx-auto">
            We're always expanding. Reach out and let's talk about your specific
            staffing needs.
          </p>
          <Link
            to="/about#contact-form"
            className="inline-flex items-center gap-2 px-8 py-3.5 
                      bg-gold text-ink rounded-full text-sm 
                      font-bold uppercase tracking-wide 
                      hover:bg-gold-light transition-colors group"
          >
            Talk to Us
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>

      {/* ─── MODAL ─── */}
      <Modal
        open={modalOpen}
        title={`Request Talent for ${selectedIndustry || 'your industry'}`}
        onClose={closeModal}
      >
        {submitted ? (
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-forest/10 text-forest">
              ✓
            </div>
            <p className="text-ink/70 leading-relaxed">
              Thanks — your request has been received. Our team will reach out
              shortly with next steps.
            </p>
            <button
              type="button"
              onClick={closeModal}
              className="inline-flex items-center justify-center w-full 
                        px-6 py-3.5 rounded-full bg-gold text-ink 
                        font-bold uppercase tracking-wide 
                        hover:bg-gold-light transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-ink/70 text-sm font-semibold">Name</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-ink/10 bg-white 
                             px-4 py-3 text-ink outline-none focus:border-gold 
                             focus:ring-2 focus:ring-gold/20"
                  required
                  placeholder="Your name"
                />
              </label>

              <label className="block">
                <span className="text-ink/70 text-sm font-semibold">Email</span>
                <input
                  value={form.email}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, email: e.target.value }))
                  }
                  className="mt-2 w-full rounded-2xl border border-ink/10 bg-white 
                             px-4 py-3 text-ink outline-none focus:border-gold 
                             focus:ring-2 focus:ring-gold/20"
                  type="email"
                  required
                  placeholder="you@company.com"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-ink/70 text-sm font-semibold">Company</span>
              <input
                value={form.company}
                onChange={(e) =>
                  setForm((s) => ({ ...s, company: e.target.value }))
                }
                className="mt-2 w-full rounded-2xl border border-ink/10 bg-white 
                           px-4 py-3 text-ink outline-none focus:border-gold 
                           focus:ring-2 focus:ring-gold/20"
                placeholder="Company (optional)"
              />
            </label>

            <label className="block">
              <span className="text-ink/70 text-sm font-semibold">Industry</span>
              <input
                value={selectedIndustry}
                readOnly
                className="mt-2 w-full rounded-2xl border border-ink/10 bg-ink/5 
                           px-4 py-3 text-ink outline-none cursor-not-allowed"
              />
            </label>

            <label className="block">
              <span className="text-ink/70 text-sm font-semibold">Message</span>
              <textarea
                value={form.message}
                onChange={(e) =>
                  setForm((s) => ({ ...s, message: e.target.value }))
                }
                className="mt-2 w-full rounded-2xl border border-ink/10 bg-white 
                           px-4 py-3 text-ink outline-none focus:border-gold 
                           focus:ring-2 focus:ring-gold/20 min-h-[120px]"
                placeholder="Tell us what roles/hours you’re looking to fill (optional)"
              />
            </label>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex items-center justify-center flex-1 px-6 py-3.5 
                           rounded-full border border-ink/15 text-ink/80 font-bold 
                           uppercase tracking-wide hover:border-ink/25 hover:text-ink 
                           transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center flex-1 px-6 py-3.5 
                           rounded-full bg-gold text-ink font-bold uppercase 
                           tracking-wide hover:bg-gold-light transition-colors"
              >
                Submit Request
              </button>
            </div>

            <p className="text-xs text-ink/50 leading-relaxed">
              This is a demo form (no backend). Replace with your existing lead
              endpoint when ready.
            </p>
          </form>
        )}
      </Modal>
    </div>
  );
}

