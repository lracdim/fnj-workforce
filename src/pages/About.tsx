import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, Phone, Mail, 
  Users, Target, Heart, Send, CheckCircle2 
} from 'lucide-react';

const timeline = [
  { year: 'Founded', title: 'F&J WorkForce is Born', body: 'Built in Rio Vista, California with a simple belief: businesses thrive when they have the right people, and people thrive when they have the right opportunity.' },
  { year: 'Growth', title: 'Expanding Across Industries', body: 'What started focused has grown into a staffing partner serving nine essential industries across Healthcare, Hospitality, IT, and beyond.' },
  { year: 'Today', title: 'A Trusted Local Partner', body: 'We continue to grow by staying close to our clients and candidates — relationships first, transactions second.' },
];

const team = [
  { initials: 'JF', name: 'Placeholder Name', role: 'Founder & Principal', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80' },
  { initials: 'MJ', name: 'Placeholder Name', role: 'Director of Recruiting', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80' },
  { initials: 'KP', name: 'Placeholder Name', role: 'Client Relations', img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80' },
];

export default function About() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-cream">

      <section className="relative w-full pt-40 pb-20 px-6 md:px-14 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              <span className="text-[12px] uppercase tracking-[0.16em] text-forest font-bold">
                Our Story
              </span>
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="font-display font-extrabold text-ink text-[38px] sm:text-[52px] leading-[1.05] tracking-[-0.03em] mb-6"
            >
              Built by people who{' '}
              <span className="accent-italic text-gold">believe</span> in people.
            </motion.h1>
            <p className="text-ink/65 text-lg leading-relaxed max-w-lg">
              F&J WorkForce LLC was founded on a simple idea: staffing should feel personal, not transactional. We're headquartered in Rio Vista, California, and we treat every placement like it matters — because it does.
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-6 relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl"
          >
            <img
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=80"
              alt="F&J WorkForce team"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      <section className="w-full bg-white py-24 px-6 md:px-14">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.2em] text-gold font-bold mb-4 block">
              Our Journey
            </span>
            <h2 className="font-display font-extrabold text-4xl text-ink">
              How We Got Here
            </h2>
          </div>
          <div className="space-y-12">
            {timeline.map((t, i) => (
              <motion.div
                key={t.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex gap-8 items-start"
              >
                <span className="font-display font-extrabold text-2xl text-gold flex-shrink-0 w-28">
                  {t.year}
                </span>
                <div className="border-l-2 border-gold/20 pl-8">
                  <h3 className="font-display font-bold text-xl text-ink mb-2">
                    {t.title}
                  </h3>
                  <p className="text-ink/60 leading-relaxed max-w-xl">
                    {t.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-cream py-24 px-6 md:px-14">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.2em] text-gold font-bold mb-4 block">
              The People Behind F&J
            </span>
            <h2 className="font-display font-extrabold text-4xl text-ink">
              Meet the Team
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-5 shadow-lg">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-display font-bold text-lg text-ink">
                  {member.name}
                </h3>
                <p className="text-forest text-sm font-medium">
                  {member.role}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-forest py-20 px-6 md:px-14">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          {[
            { icon: Heart, label: 'People First', body: 'Every decision starts with the person on the other side.' },
            { icon: Target, label: 'Precision Matching', body: "We don't fill seats — we find the right fit." },
            { icon: Users, label: 'Long-Term Relationships', body: 'We measure success by who stays, not just who starts.' },
          ].map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.label}>
                <div className="w-14 h-14 rounded-full bg-gold/15 flex items-center justify-center mx-auto mb-5">
                  <Icon size={24} className="text-gold" />
                </div>
                <h3 className="text-cream font-display font-bold text-lg mb-2">
                  {v.label}
                </h3>
                <p className="text-cream/60 text-sm leading-relaxed">
                  {v.body}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section id="contact-form" className="w-full bg-white py-28 px-6 md:px-14 scroll-mt-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">

          <div className="lg:col-span-5">
            <span className="text-xs uppercase tracking-[0.2em] text-gold font-bold mb-4 block">
              Get in Touch
            </span>
            <h2 className="font-display font-extrabold text-4xl text-ink mb-6 leading-tight">
              Let's Bring Talent and<br />Opportunity Together.
            </h2>
            <p className="text-ink/65 leading-relaxed mb-10 max-w-sm">
              Whether you're hiring or looking for your next role, we'd love to hear from you.
            </p>

            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-gold-dark" />
                </div>
                <span className="text-ink/75 text-sm">Rio Vista, California</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <Phone size={18} className="text-gold-dark" />
                </div>
                <span className="text-ink/75 text-sm">[Phone TODO]</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <Mail size={18} className="text-gold-dark" />
                </div>
                <span className="text-ink/75 text-sm">[Email TODO]</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-forest/5 border border-forest/15 rounded-3xl p-12 text-center"
              >
                <CheckCircle2 size={40} className="text-forest mx-auto mb-5" />
                <h3 className="font-display font-bold text-2xl text-ink mb-2">
                  Message Sent
                </h3>
                <p className="text-ink/60">
                  Thanks for reaching out — we'll be in touch soon.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-cream rounded-3xl p-8 sm:p-10 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-semibold text-ink/70 uppercase tracking-wide mb-2 block">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-ink/10 text-ink focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ink/70 uppercase tracking-wide mb-2 block">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-ink/10 text-ink focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink/70 uppercase tracking-wide mb-2 block">
                    Company (Optional)
                  </label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-ink/10 text-ink focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink/70 uppercase tracking-wide mb-2 block">
                    How Can We Help?
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-ink/10 text-ink focus:outline-none focus:border-gold transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-forest text-cream rounded-full text-sm font-bold uppercase tracking-wide hover:bg-forest-dark transition-colors group"
                >
                  Send Message
                  <Send size={16} className="transition-transform group-hover:translate-x-1" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}