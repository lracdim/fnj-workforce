import { useState, useEffect } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import Topbar from '../components/layout/Topbar';
import { storage } from '../utils/storage';
import { SEED_WEBSITE_CONTENT } from '../data/seed';
import { Save, Layout, Users, Phone, Footprints } from 'lucide-react';

type SectionKey = 'hero' | 'about' | 'contact' | 'footer';

interface WebsiteContent {
  hero: { headline: string; subtext: string; ctaPrimary: string; ctaSecondary: string; location: string };
  about: { heading: string; body: string; mission: string; vision: string };
  contact: { heading: string; subtext: string; address: string; phone: string; email: string };
  footer: { tagline: string };
}

const sections: { key: SectionKey; label: string; icon: React.ElementType }[] = [
  { key: 'hero', label: 'Hero Section', icon: Layout },
  { key: 'about', label: 'About Section', icon: Users },
  { key: 'contact', label: 'Contact Info', icon: Phone },
  { key: 'footer', label: 'Footer', icon: Footprints },
];

const defaultContent: WebsiteContent = SEED_WEBSITE_CONTENT as WebsiteContent;

export default function WebsiteEditor() {
  const [active, setActive] = useState<SectionKey>('hero');
  const [content, setContent] = useState<WebsiteContent>(defaultContent);
  const [toast, setToast] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const saved = storage.get<WebsiteContent>('fnj_website_content');
    if (saved) setContent(saved);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 400));
    storage.set('fnj_website_content', content);
    setSaving(false);
    showToast('Changes saved. Reload the public site to see updates.');
  };

  const update = (section: SectionKey, field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      [section]: { ...(prev[section] as Record<string, string>), [field]: value },
    }));
  };

  return (
    <AdminLayout>
      <Topbar title="Website Editor" subtitle="Modify public site content" />
      <div className="p-6">
        <div className="flex gap-6 h-[calc(100vh-120px)]">

          {/* Sidebar */}
          <div className="w-56 flex-shrink-0 bg-white border border-[#E4E0D8] rounded-xl overflow-y-auto">
            <div className="p-4 border-b border-[#E4E0D8]">
              <p className="text-[10px] uppercase tracking-widest text-[#9CA3AF] font-bold">Sections</p>
            </div>
            <div className="p-2">
              {sections.map(s => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.key}
                    onClick={() => setActive(s.key)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-0.5
                      ${active === s.key ? 'bg-[#0E5C3F] text-white font-bold' : 'text-[#6B7280] hover:bg-[#F9F8F5] hover:text-[#16201C]'}`}
                  >
                    <Icon size={14} />
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Editor panel */}
          <div className="flex-1 bg-white border border-[#E4E0D8] rounded-xl overflow-y-auto">
            <div className="p-6 border-b border-[#E4E0D8] flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h2 className="font-black uppercase text-[#16201C] text-sm tracking-tight">
                  {sections.find(s => s.key === active)?.label}
                </h2>
                <p className="text-[10px] text-[#9CA3AF] mt-0.5">Edit content and save to apply changes</p>
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#0E5C3F] text-white font-black uppercase text-xs rounded-lg hover:bg-[#073D29] transition-colors disabled:opacity-60"
              >
                <Save size={14} />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            <div className="p-8 space-y-6">

              {/* HERO SECTION */}
              {active === 'hero' && (
                <>
                  <div className="bg-[#F9F8F5] rounded-xl p-5 border border-[#E4E0D8]">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] mb-4">Preview</p>
                    <div className="space-y-2">
                      <h1 className="text-2xl font-black text-[#16201C] leading-tight">
                        {content.hero.headline}
                      </h1>
                      <p className="text-sm text-[#6B7280] leading-relaxed">{content.hero.subtext}</p>
                      <div className="flex gap-2 pt-1">
                        <span className="px-3 py-1 bg-[#0E5C3F] text-white text-xs font-bold rounded-full">{content.hero.ctaPrimary}</span>
                        <span className="px-3 py-1 bg-[#0E5C3F] text-white text-xs font-bold rounded-full">{content.hero.ctaSecondary}</span>
                      </div>
                      <p className="text-[10px] text-[#9CA3AF] mt-2">{content.hero.location}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#16201C] block mb-1.5">Main Headline</label>
                    <input value={content.hero.headline} onChange={e => update('hero', 'headline', e.target.value)}
                      className="w-full px-4 py-3 text-sm bg-[#F9F8F5] border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#16201C] block mb-1.5">Subtext</label>
                    <textarea value={content.hero.subtext} onChange={e => update('hero', 'subtext', e.target.value)} rows={3}
                      className="w-full px-4 py-3 text-sm bg-[#F9F8F5] border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#16201C] block mb-1.5">Primary CTA Label</label>
                      <input value={content.hero.ctaPrimary} onChange={e => update('hero', 'ctaPrimary', e.target.value)}
                        className="w-full px-4 py-3 text-sm bg-[#F9F8F5] border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors" />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#16201C] block mb-1.5">Secondary CTA Label</label>
                      <input value={content.hero.ctaSecondary} onChange={e => update('hero', 'ctaSecondary', e.target.value)}
                        className="w-full px-4 py-3 text-sm bg-[#F9F8F5] border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#16201C] block mb-1.5">Location Label</label>
                    <input value={content.hero.location} onChange={e => update('hero', 'location', e.target.value)}
                      className="w-full px-4 py-3 text-sm bg-[#F9F8F5] border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors" />
                  </div>
                </>
              )}

              {/* ABOUT SECTION */}
              {active === 'about' && (
                <>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#16201C] block mb-1.5">Hero Heading</label>
                    <input value={content.about.heading} onChange={e => update('about', 'heading', e.target.value)}
                      className="w-full px-4 py-3 text-sm bg-[#F9F8F5] border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#16201C] block mb-1.5">Hero Body</label>
                    <textarea value={content.about.body} onChange={e => update('about', 'body', e.target.value)} rows={3}
                      className="w-full px-4 py-3 text-sm bg-[#F9F8F5] border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors resize-none" />
                  </div>
                  <div className="bg-[#0E5C3F]/5 border border-[#0E5C3F]/20 rounded-xl p-5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#0E5C3F] block mb-1.5">Mission Statement</label>
                    <textarea value={content.about.mission} onChange={e => update('about', 'mission', e.target.value)} rows={2}
                      className="w-full px-4 py-3 text-sm bg-white border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors resize-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#16201C] block mb-1.5">Vision Statement</label>
                    <textarea value={content.about.vision} onChange={e => update('about', 'vision', e.target.value)} rows={2}
                      className="w-full px-4 py-3 text-sm bg-[#F9F8F5] border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors resize-none" />
                  </div>
                </>
              )}

              {/* CONTACT SECTION */}
              {active === 'contact' && (
                <>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#16201C] block mb-1.5">Section Heading</label>
                    <input value={content.contact.heading} onChange={e => update('contact', 'heading', e.target.value)}
                      className="w-full px-4 py-3 text-sm bg-[#F9F8F5] border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#16201C] block mb-1.5">Sub-heading</label>
                    <input value={content.contact.subtext} onChange={e => update('contact', 'subtext', e.target.value)}
                      className="w-full px-4 py-3 text-sm bg-[#F9F8F5] border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#16201C] block mb-1.5">Address</label>
                      <input value={content.contact.address} onChange={e => update('contact', 'address', e.target.value)}
                        className="w-full px-4 py-3 text-sm bg-[#F9F8F5] border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors" />
                    </div>
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#16201C] block mb-1.5">Phone Number</label>
                      <input value={content.contact.phone} onChange={e => update('contact', 'phone', e.target.value)}
                        className="w-full px-4 py-3 text-sm bg-[#F9F8F5] border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#16201C] block mb-1.5">Email Address</label>
                    <input value={content.contact.email} onChange={e => update('contact', 'email', e.target.value)}
                      className="w-full px-4 py-3 text-sm bg-[#F9F8F5] border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors" />
                  </div>
                </>
              )}

              {/* FOOTER */}
              {active === 'footer' && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#16201C] block mb-1.5">Brand Tagline</label>
                  <input value={content.footer.tagline} onChange={e => setContent(prev => ({ ...prev, footer: { tagline: e.target.value } }))}
                    className="w-full px-4 py-4 text-base bg-[#F9F8F5] border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors" />
                  <p className="text-[10px] text-[#9CA3AF] mt-2">This appears in the footer of every page on the public site.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#16201C] text-white px-5 py-3 rounded-xl text-sm font-medium shadow-xl z-50 flex items-center gap-2">
          <span className="w-2 h-2 bg-[#0E5C3F] rounded-full" />
          {toast}
        </div>
      )}
    </AdminLayout>
  );
}