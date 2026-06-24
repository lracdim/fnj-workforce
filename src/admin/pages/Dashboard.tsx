import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Briefcase, UserCheck, Building2, Calendar, TrendingUp, Activity, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import AdminLayout from '../components/layout/AdminLayout';
import Topbar from '../components/layout/Topbar';
import StatCard from '../components/ui/StatCard';
import StatusBadge from '../components/ui/StatusBadge';
import { storage } from '../utils/storage';
import { initializeData, type Candidate, type JobOrder, type Placement, type Interview, type ActivityEntry, type ClientCompany } from '../data/seed';

const PLACEMENT_CHART = [
  { month: 'Oct', placements: 3 }, { month: 'Nov', placements: 5 },
  { month: 'Dec', placements: 2 }, { month: 'Jan', placements: 7 },
  { month: 'Feb', placements: 4 }, { month: 'Mar', placements: 8 },
];

const INDUSTRY_PIE = [
  { name: 'Healthcare', value: 35, color: '#0E5C3F' },
  { name: 'IT', value: 20, color: '#0E5C3F' },
  { name: 'Hospitality', value: 18, color: '#3B82F6' },
  { name: 'Manufacturing', value: 15, color: '#8B5CF6' },
  { name: 'Other', value: 12, color: '#9CA3AF' },
];

const getTimeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return `${mins}m ago`;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobOrders, setJobOrders] = useState<JobOrder[]>([]);
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [companies, setCompanies] = useState<ClientCompany[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);

  useEffect(() => {
    initializeData();
    setCandidates(storage.get<Candidate[]>('fnj_candidates') || []);
    setJobOrders(storage.get<JobOrder[]>('fnj_job_orders') || []);
    setPlacements(storage.get<Placement[]>('fnj_placements') || []);
    setCompanies(storage.get<ClientCompany[]>('fnj_companies') || []);
    setInterviews(storage.get<Interview[]>('fnj_interviews') || []);
    setActivity(storage.get<ActivityEntry[]>('fnj_activity') || []);
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const available = candidates.filter(c => c.status === 'available').length;
  const openOrders = jobOrders.filter(j => j.status === 'open').length;
  const activePlacements = placements.filter(p => p.status === 'active').length;
  const upcoming = interviews.filter(i => i.status === 'scheduled').length;
  const filledAllTime = jobOrders.filter(j => j.status === 'filled').length;
  const fillRate = jobOrders.length > 0 ? Math.round(filledAllTime / jobOrders.length * 100) : 0;

  return (
    <AdminLayout>
      <Topbar title="Dashboard" subtitle={`${greeting()}, Admin — here's your overview.`} />
      <div className="p-6 space-y-6">

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Available Candidates" value={available} icon={Users} trend="ready to place" trendUp={true} />
          <StatCard title="Open Job Orders" value={openOrders} icon={Briefcase} accent={openOrders > 0} />
          <StatCard title="Active Placements" value={activePlacements} icon={UserCheck} trend="currently placed" trendUp={true} />
          <StatCard title="Upcoming Interviews" value={upcoming} icon={Calendar} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white border border-[#E4E0D8] rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-black text-[#16201C] uppercase text-sm tracking-tight">Placement Volume</h3>
                <p className="text-xs text-[#9CA3AF] mt-0.5">Last 6 months</p>
              </div>
              <span className="text-xs text-[#0E5C3F] font-bold uppercase tracking-wider">29 total</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={PLACEMENT_CHART} barCategoryGap="30%">
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E4E0D8', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="placements" fill="#0E5C3F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white border border-[#E4E0D8] rounded-xl p-6">
            <div className="mb-4">
              <h3 className="font-black text-[#16201C] uppercase text-sm tracking-tight">By Industry</h3>
              <p className="text-xs text-[#9CA3AF] mt-0.5">All time breakdown</p>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={INDUSTRY_PIE} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" strokeWidth={0}>
                  {INDUSTRY_PIE.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E4E0D8', borderRadius: '8px', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {INDUSTRY_PIE.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                    <span className="text-[11px] text-[#6B7280]">{item.name}</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#16201C]">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white border border-[#E4E0D8] rounded-xl">
            <div className="flex items-center justify-between p-5 border-b border-[#E4E0D8]">
              <h3 className="font-black text-[#16201C] uppercase text-sm tracking-tight">Upcoming Interviews</h3>
              <button onClick={() => navigate('/admin/interviews')} className="flex items-center gap-1 text-xs text-[#0E5C3F] font-bold uppercase tracking-wider hover:underline">
                View All <ArrowRight size={12} />
              </button>
            </div>
            {interviews.filter(i => i.status === 'scheduled').length === 0 ? (
              <p className="p-6 text-sm text-[#9CA3AF] text-center">No upcoming interviews.</p>
            ) : (
              <div className="divide-y divide-[#E4E0D8]">
                {interviews.filter(i => i.status === 'scheduled').map(interview => (
                  <div key={interview.id} className="px-5 py-4 hover:bg-[#F9F8F5] transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-bold text-[#16201C]">{interview.candidateName}</p>
                        <p className="text-xs text-[#6B7280]">{interview.role} · {interview.clientName}</p>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={interview.type} size="sm" />
                        <p className="text-[10px] text-[#9CA3AF] mt-1">{new Date(interview.scheduledAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white border border-[#E4E0D8] rounded-xl">
            <div className="flex items-center justify-between p-5 border-b border-[#E4E0D8]">
              <h3 className="font-black text-[#16201C] uppercase text-sm tracking-tight">Activity</h3>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            </div>
            <div className="p-4 space-y-3 overflow-y-auto max-h-[340px]">
              {activity.map((act) => (
                <div key={act.id} className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-[#F9F8F5] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Activity size={13} className="text-[#0E5C3F]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-[#16201C] leading-relaxed">{act.description}</p>
                    <span className="text-[10px] text-[#9CA3AF] mt-0.5 block">{getTimeAgo(act.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Candidates', value: candidates.length, icon: Users },
            { label: 'Client Companies', value: companies.length, icon: Building2 },
            { label: 'Jobs Filled (All Time)', value: filledAllTime, icon: UserCheck },
            { label: 'Fill Rate', value: `${fillRate}%`, icon: TrendingUp },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="bg-white border border-[#E4E0D8] rounded-xl p-5">
                <Icon size={16} className="text-[#0E5C3F] mb-2" />
                <p className="text-2xl font-black text-[#16201C]">{s.value}</p>
                <p className="text-[10px] uppercase tracking-wider text-[#9CA3AF] mt-0.5">{s.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}