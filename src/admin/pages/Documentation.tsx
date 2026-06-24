import AdminLayout from '../components/layout/AdminLayout';
import Topbar from '../components/layout/Topbar';

const features = (label: string, items: string[]) => (
  <div className="mb-8">
    <h4 className="text-sm font-black uppercase tracking-wider text-[#0E5C3F] mb-3">{label}</h4>
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0E5C3F] mt-1.5 flex-shrink-0" />
          <span className="text-sm text-[#6B7280]">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default function AdminDocumentation() {
  return (
    <AdminLayout>
      <Topbar title="Documentation" subtitle="Platform overview and roadmap" />
      <div className="p-6 max-w-4xl mx-auto">

        {/* Phase 1 */}
        <div className="bg-white border border-[#E4E0D8] rounded-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#0E5C3F] rounded-lg flex items-center justify-center">
              <span className="font-black text-black text-sm">01</span>
            </div>
            <div>
              <h2 className="font-black uppercase text-[#16201C] tracking-tight">Phase 1 — Marketing Website</h2>
              <p className="text-xs text-[#9CA3AF]">Completed</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              {features('Pages Built', [
                'Home (Hero, Services Preview, Industries, Blog Preview, CTA)',
                'Services (4 services with alternating image/text layout)',
                'About (Company story, timeline, team, contact form)',
                'Industries (9 industry cards with photography)',
                'Resources / Blog (filterable article grid)',
                'Resource Detail (full article with related posts)',
                'Contact form (functional, localStorage-based)',
              ])}
            </div>
            <div>
              {features('Public Site Features', [
                'Smooth scroll with Lenis + GSAP ScrollTrigger',
                'Framer Motion animations throughout',
                'Responsive mobile-first design',
                'Custom color system (gold/forest/cream/ink)',
                'Real Unsplash photography (no placeholder images)',
                'localStorage-based CMS for website content',
                'SEO-ready structure with semantic HTML',
              ])}
            </div>
          </div>
        </div>

        {/* Phase 2 */}
        <div className="bg-white border border-[#E4E0D8] rounded-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#0E5C3F] rounded-lg flex items-center justify-center">
              <span className="font-black text-white text-sm">02</span>
            </div>
            <div>
              <h2 className="font-black uppercase text-[#16201C] tracking-tight">Phase 2 — Admin Dashboard</h2>
              <p className="text-xs text-[#9CA3AF]">Completed</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              {features('CRM', [
                'Candidate management (add, edit, profile, search, filter)',
                'Client company management (add, edit, profile, tabs)',
                'Job order tracking (create, assign, status pipeline)',
                'Placement records (create with automatic status updates)',
                'Hiring pipeline (kanban-style board)',
              ])}
            </div>
            <div>
              {features('Operations', [
                'Interview scheduling and outcome tracking',
                'Activity log (all system events, filterable)',
                'Reports dashboard (charts: placements, industries, pipeline)',
              ])}
            </div>
            <div>
              {features('Content & CMS', [
                'Blog post CMS (create, edit, publish/unpublish, delete)',
                'Website content editor (hero, about, contact, footer)',
                'All localStorage-based — no backend required',
              ])}
            </div>
          </div>
        </div>

        {/* Phase 3 */}
        <div className="bg-[#16201C] rounded-xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#0E5C3F] rounded-lg flex items-center justify-center">
              <span className="font-black text-black text-sm">03</span>
            </div>
            <div>
              <h2 className="font-black uppercase text-white tracking-tight">Phase 3 — Full Platform</h2>
              <p className="text-xs text-[#6B7280]">Roadmap</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              {features('Infrastructure', [
                'PostgreSQL database via Railway (real data persistence)',
                'REST API or tRPC layer for type-safe data access',
                'User authentication (email/password, roles: admin, recruiter, view-only)',
                'Client self-service job order submission portal',
                'Candidate application portal (public-facing careers page)',
              ])}
            </div>
            <div>
              {features('Automation & Tools', [
                'Indeed / LinkedIn job board auto-posting integration',
                'Automated email sequences for candidates (stage-based)',
                'SMS notifications for interview reminders (Twilio)',
                'Document upload (resumes, contracts) via S3',
                'E-signature for placement agreements (DocuSign or HelloSign)',
                'Advanced analytics: time-to-fill, source tracking, recruiter performance',
                'Multi-user roles and permissions (recruiter, admin, view-only)',
              ])}
            </div>
          </div>
        </div>

        {/* Investment */}
        <div className="bg-white border border-[#E4E0D8] rounded-xl p-8 mb-6">
          <h2 className="font-black uppercase text-[#16201C] tracking-tight text-lg mb-6">Investment & ROI</h2>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center p-6 bg-[#F9F8F5] rounded-xl">
              <p className="text-3xl font-black text-[#0E5C3F]">$3,500</p>
              <p className="text-sm text-[#6B7280] mt-1">Phase 3 minimum</p>
            </div>
            <div className="text-center p-6 bg-[#F9F8F5] rounded-xl">
              <p className="text-3xl font-black text-[#0E5C3F]">$7,000</p>
              <p className="text-sm text-[#6B7280] mt-1">Phase 3 full scope</p>
            </div>
            <div className="text-center p-6 bg-[#F9F8F5] rounded-xl">
              <p className="text-3xl font-black text-[#0E5C3F]">10–14</p>
              <p className="text-sm text-[#6B7280] mt-1">Weeks to complete</p>
            </div>
          </div>
          <p className="text-sm text-[#6B7280] mt-6 leading-relaxed">
            Phase 3 transforms the admin dashboard from a demo into a production-grade applicant tracking system. 
            ROI is measured in recruiter hours saved, reduced time-to-fill, and fewer mis-hires.
          </p>
        </div>

        {/* Next Steps */}
        <div className="bg-white border border-[#E4E0D8] rounded-xl p-8">
          <h2 className="font-black uppercase text-[#16201C] tracking-tight text-lg mb-6">Next Steps</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-[#F9F8F5] rounded-xl">
              <div className="w-8 h-8 bg-[#0E5C3F] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="font-black text-black text-xs">1</span>
              </div>
              <div>
                <p className="text-sm font-bold text-[#16201C]">Review the admin dashboard</p>
                <p className="text-xs text-[#6B7280] mt-0.5">Sign in at /admin — demo credentials are pre-filled on the login page.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-[#F9F8F5] rounded-xl">
              <div className="w-8 h-8 bg-[#0E5C3F] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="font-black text-black text-xs">2</span>
              </div>
              <div>
                <p className="text-sm font-bold text-[#16201C]">Confirm team member info</p>
                <p className="text-xs text-[#6B7280] mt-0.5">The About page team section uses placeholder photos and names — provide real team bios and headshots when ready.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-[#F9F8F5] rounded-xl">
              <div className="w-8 h-8 bg-[#0E5C3F] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="font-black text-black text-xs">3</span>
              </div>
              <div>
                <p className="text-sm font-bold text-[#16201C]">Decide on Phase 3 scope</p>
                <p className="text-xs text-[#6B7280] mt-0.5">Choose which Phase 3 features to prioritize based on immediate business needs.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#E4E0D8]">
            <p className="text-xs text-[#9CA3AF] uppercase tracking-widest font-bold mb-3">Built by</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#0E5C3F] rounded-full flex items-center justify-center">
                <span className="font-black text-black text-sm">JD</span>
              </div>
              <div>
                <p className="text-sm font-bold text-[#16201C]">John Carl Dimatulac</p>
                <p className="text-xs text-[#6B7280]">lracdim@gmail.com</p>
                <p className="text-xs text-[#9CA3AF] mt-0.5">Daybreak Productions</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}