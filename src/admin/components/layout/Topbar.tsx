import { useState } from 'react';
import { Search, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface TopbarProps {
  title: string;
  subtitle?: string;
}

export default function Topbar({ title, subtitle }: TopbarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-[#E4E0D8] flex items-center justify-between px-6 sticky top-0 z-30">
      <div>
        <h1 className="text-lg font-black uppercase text-[#16201C] tracking-tight leading-none">{title}</h1>
        {subtitle && <p className="text-xs text-[#9CA3AF] mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 text-sm bg-[#F9F8F5] border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors w-52"
          />
        </div>

        <button className="relative p-2 hover:bg-[#F9F8F5] rounded-lg transition-colors">
          <Bell size={18} className="text-[#6B7280]" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#0E5C3F] rounded-full" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8 bg-[#0E5C3F] rounded-full flex items-center justify-center text-xs font-black text-white hover:bg-[#073D29] transition-colors"
          >
            AD
          </button>
          {showMenu && (
            <div className="absolute right-0 top-10 w-48 bg-white border border-[#E4E0D8] rounded-xl shadow-lg z-50 py-1"
                 onMouseLeave={() => setShowMenu(false)}>
              <div className="px-4 py-3 border-b border-[#E4E0D8]">
                <p className="text-xs font-black text-[#16201C] uppercase tracking-tight">Admin</p>
                <p className="text-[10px] text-[#9CA3AF]">{user?.email}</p>
              </div>
              <div className="border-t border-[#E4E0D8] mt-1 pt-1">
                <button
                  onClick={() => { logout(); navigate('/admin/login'); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={13} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}