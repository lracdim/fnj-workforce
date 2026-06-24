import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, MapPin, Phone, Mail, Users, ArrowRight } from 'lucide-react';
import { useContactModal } from '../../context/ContactModalContext';

const highlights = [
  { icon: Users, label: '9 Industries Served', sub: 'Healthcare, IT, Hospitality & more' },
  { icon: MapPin, label: 'Based in Rio Vista, CA', sub: 'Serving local & regional clients' },
  { icon: ArrowRight, label: 'Fast Turnaround', sub: 'We respond within 1 business day' },
];

export default function ContactModal() {
  const { isOpen, closeModal } = useContactModal();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setSubmitted(false);
        setForm({ name: '', email: '', company: '', message: '' });
      }, 400);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeModal}
            className="fixed inset-0 z-[200] bg-ink/60 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4 sm:p-8 pointer-events-none"
          >
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl pointer-events-auto flex flex-col lg:flex-row">

              {/* Left panel — brand */}
              <div className="hidden lg:flex flex-col justify-between bg-forest p-10 w-[340px] flex-shrink-0">
                <div>
                  <div className="mb-8">
                    <span className="font-black text-2xl text-gold" style={{ fontFamily: 'serif' }}>F&J</span>
                    <span className="text-xs uppercase tracking-widest text-cream/60 font-bold ml-2">WorkForce</span>
                  </div>
                  <h2 className="font-display font-extrabold text-cream text-2xl leading-tight mb-3">
                    Let's find the{' '}
                    <span className="accent-italic text-gold">right fit</span>{' '}
                    together.
                  </h2>
                  <p className="text-cream/60 text-sm leading-relaxed">
                    Whether you're building a team or looking for your next role, we're ready to help you move forward.
                  </p>
                </div>

                <div className="space-y-5">
                  {highlights.map(({ icon: Icon, label, sub }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cream/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon size={15} className="text-gold" />
                      </div>
                      <div>
                        <p className="text-cream text-sm font-semibold">{label}</p>
                        <p className="text-cream/50 text-xs">{sub}</p>
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 space-y-2 border-t border-cream/10">
                    <div className="flex items-center gap-2 text-cream/50 text-xs">
                      <Phone size={12} />
                      <span>[Phone TODO]</span>
                    </div>
                    <div className="flex items-center gap-2 text-cream/50 text-xs">
                      <Mail size={12} />
                      <span>[Email TODO]</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right panel — form */}
              <div className="flex-1 bg-cream overflow-y-auto">
                <div className="p-8 sm:p-10">
                  {/* Close button */}
                  <button
                    onClick={closeModal}
                    className="absolute top-5 right-5 w-9 h-9 rounded-full bg-ink/8 hover:bg-ink/15 flex items-center justify-center transition-colors z-10"
                  >
                    <X size={16} className="text-ink" />
                  </button>

                  {submitted ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-center justify-center h-full min-h-[360px] text-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-forest/10 flex items-center justify-center mb-5">
                        <CheckCircle2 size={32} className="text-forest" />
                      </div>
                      <h3 className="font-display font-bold text-2xl text-ink mb-2">Message Sent</h3>
                      <p className="text-ink/55 text-sm max-w-xs">
                        Thanks for reaching out — we'll be in touch within one business day.
                      </p>
                      <button
                        onClick={closeModal}
                        className="mt-8 px-6 py-2.5 bg-forest text-cream rounded-full text-xs font-bold uppercase tracking-wide hover:bg-forest-dark transition-colors"
                      >
                        Close
                      </button>
                    </motion.div>
                  ) : (
                    <>
                      <div className="mb-7 pr-10">
                        <h3 className="font-display font-extrabold text-2xl text-ink mb-1">Get in Touch</h3>
                        <p className="text-ink/50 text-sm">Fill out the form and we'll reach out shortly.</p>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[11px] font-semibold text-ink/60 uppercase tracking-wider mb-1.5 block">
                              Full Name <span className="text-gold">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={form.name}
                              onChange={(e) => setForm({ ...form, name: e.target.value })}
                              placeholder="Jane Smith"
                              className="w-full px-4 py-3 rounded-xl bg-white border border-ink/10 text-ink text-sm placeholder:text-ink/30 focus:outline-none focus:border-forest transition-colors"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-semibold text-ink/60 uppercase tracking-wider mb-1.5 block">
                              Email <span className="text-gold">*</span>
                            </label>
                            <input
                              type="email"
                              required
                              value={form.email}
                              onChange={(e) => setForm({ ...form, email: e.target.value })}
                              placeholder="jane@company.com"
                              className="w-full px-4 py-3 rounded-xl bg-white border border-ink/10 text-ink text-sm placeholder:text-ink/30 focus:outline-none focus:border-forest transition-colors"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-ink/60 uppercase tracking-wider mb-1.5 block">
                            Company <span className="text-ink/30">(optional)</span>
                          </label>
                          <input
                            type="text"
                            value={form.company}
                            onChange={(e) => setForm({ ...form, company: e.target.value })}
                            placeholder="Your organization"
                            className="w-full px-4 py-3 rounded-xl bg-white border border-ink/10 text-ink text-sm placeholder:text-ink/30 focus:outline-none focus:border-forest transition-colors"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-semibold text-ink/60 uppercase tracking-wider mb-1.5 block">
                            How Can We Help? <span className="text-gold">*</span>
                          </label>
                          <textarea
                            required
                            rows={4}
                            value={form.message}
                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                            placeholder="Tell us about your hiring needs or what kind of role you're looking for..."
                            className="w-full px-4 py-3 rounded-xl bg-white border border-ink/10 text-ink text-sm placeholder:text-ink/30 focus:outline-none focus:border-forest transition-colors resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-forest text-cream rounded-full text-sm font-bold uppercase tracking-wide hover:bg-forest-dark transition-colors group"
                        >
                          Send Message
                          <Send size={15} className="transition-transform group-hover:translate-x-0.5" />
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
