import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Users, Building2,
  Briefcase, UserCheck, GitMerge,
  Calendar, Activity, BarChart2,
  FileText, Layout, BookOpen,
  LogOut
} from 'lucide-react';

const navGroups = [
  { label: null, items: [{ label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard }] },
  {
    label: 'CRM',
    items: [
      { label: 'Candidates', href: '/admin/candidates', icon: Users },
      { label: 'Client Companies', href: '/admin/companies', icon: Building2 },
      { label: 'Job Orders', href: '/admin/job-orders', icon: Briefcase },
      { label: 'Placements', href: '/admin/placements', icon: UserCheck },
      { label: 'Pipeline', href: '/admin/pipeline', icon: GitMerge },
    ],
  },
  {
    label: 'Operations',
    items: [
      { label: 'Interviews', href: '/admin/interviews', icon: Calendar },
      { label: 'Activity Log', href: '/admin/activity', icon: Activity },
      { label: 'Reports', href: '/admin/reports', icon: BarChart2 },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'Blog Posts', href: '/admin/blog', icon: FileText },
      { label: 'Website Editor', href: '/admin/website-editor', icon: Layout },
    ],
  },
  {
    label: 'Settings',
    items: [{ label: 'Documentation', href: '/admin/docs', icon: BookOpen }],
  },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  return (
    <aside className="w-[240px] flex-shrink-0 bg-white border-r border-[#E4E0D8] flex flex-col h-screen sticky top-0 overflow-y-auto">
      <div className="px-6 py-5 border-b border-[#E4E0D8]">
        <div className="flex items-baseline gap-1.5">
          <span className="font-black text-lg text-[#0E5C3F]" style={{ fontFamily: 'serif' }}>F&J</span>
          <span className="text-xs uppercase tracking-widest text-[#0E5C3F] font-bold">WorkForce</span>
        </div>
        <span className="text-[10px] text-[#9CA3AF] uppercase tracking-widest">Admin Portal</span>
      </div>

      <nav className="flex-1 p-4 space-y-6">
        {navGroups.map((group, gi) => (
          <div key={gi}>
            {group.label && <p className="text-[10px] uppercase tracking-widest text-[#9CA3AF] font-bold px-3 mb-2">{group.label}</p>}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${isActive ? 'bg-[#0E5C3F] text-white font-bold' : 'text-[#6B7280] hover:bg-[#F9F8F5] hover:text-[#16201C]'}`
                    }
                  >
                    <Icon size={16} />
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-[#E4E0D8]">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#6B7280] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <LogOut size={16} />
          Sign Out
        </button>
        <p className="text-[10px] text-[#9CA3AF] text-center mt-3">Demo v1.0</p>
      </div>
    </aside>
  );
}