import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import Topbar from '../components/layout/Topbar';
import { storage } from '../utils/storage';
import { initializeData, type ActivityEntry } from '../data/seed';

const FILTER_TABS = [
  { label: 'All', value: 'all' },
  { label: 'Candidates', value: 'candidate' },
  { label: 'Placements', value: 'placement' },
  { label: 'Job Orders', value: 'job_order' },
  { label: 'Interviews', value: 'interview' },
  { label: 'Companies', value: 'company' },
  { label: 'Blog', value: 'blog' },
];

const TYPE_STYLES: Record<string, { bg: string; text: string; icon: string }> = {
  candidate_added: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'C' },
  status_changed: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'S' },
  placement_created: { bg: 'bg-green-50', text: 'text-green-600', icon: 'P' },
  job_order_opened: { bg: 'bg-amber-50', text: 'text-amber-600', icon: 'J' },
  interview_scheduled: { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'I' },
  company_added: { bg: 'bg-cyan-50', text: 'text-cyan-600', icon: 'Co' },
  blog_published: { bg: 'bg-rose-50', text: 'text-rose-600', icon: 'B' },
};

const getRelativeTime = (isoString: string): string => {
  const now = new Date();
  const date = new Date(isoString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export default function ActivityLog() {
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    initializeData();
    const data = storage.get<ActivityEntry[]>('fnj_activity') || [];
    const sorted = [...data].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    setActivities(sorted);
  }, []);

  const filtered = activities.filter(activity => {
    const filterMatch = activeFilter === 'all' || activity.entityType === activeFilter;
    const q = search.toLowerCase();
    const searchMatch = !q || activity.description.toLowerCase().includes(q);
    return filterMatch && searchMatch;
  });

  return (
    <AdminLayout>
      <Topbar title="Activity Log" subtitle="All system activity" />
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1 bg-white border border-[#E4E0D8] rounded-lg p-1 overflow-x-auto">
            {FILTER_TABS.map(tab => (
              <button
                key={tab.value}
                onClick={() => setActiveFilter(tab.value)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors whitespace-nowrap ${
                  activeFilter === tab.value ? 'bg-[#16201C] text-white' : 'text-[#6B7280] hover:bg-[#F9F8F5]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search activity..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm bg-white border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors w-64"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E4E0D8] overflow-hidden">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-sm text-[#9CA3AF]">
              No activity found
            </div>
          ) : (
            <div className="max-h-[600px] overflow-y-auto">
              {filtered.map((activity, index) => {
                const style = TYPE_STYLES[activity.type] || TYPE_STYLES.status_changed;
                return (
                  <div
                    key={activity.id}
                    className={`flex items-center gap-4 px-5 py-4 hover:bg-[#F9F8F5] transition-colors ${
                      index !== filtered.length - 1 ? 'border-b border-[#E4E0D8]/50' : ''
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-full ${style.bg} ${style.text} flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                      {style.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#16201C] truncate">{activity.description}</p>
                    </div>
                    <span className="bg-[#F9F8F5] text-[#6B7280] px-2 py-0.5 rounded text-[10px] font-medium flex-shrink-0">
                      {activity.entityType}
                    </span>
                    <span 
                      className="text-[10px] text-[#9CA3AF] flex-shrink-0 tabular-nums"
                      title={new Date(activity.timestamp).toLocaleString()}
                    >
                      {getRelativeTime(activity.timestamp)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}