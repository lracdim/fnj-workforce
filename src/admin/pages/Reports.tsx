import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import AdminLayout from '../components/layout/AdminLayout';
import Topbar from '../components/layout/Topbar';
import { storage } from '../utils/storage';
import { initializeData, type Placement, type JobOrder, type Candidate, type ClientCompany, type Interview } from '../data/seed';

const COLORS = ['#0E5C3F', '#0E5C3F', '#3B82F6', '#8B5CF6', '#9CA3AF'];

const MOCK_MONTHLY_DATA = [
  { month: 'Oct', placements: 3 }, { month: 'Nov', placements: 5 },
  { month: 'Dec', placements: 2 }, { month: 'Jan', placements: 7 },
  { month: 'Feb', placements: 4 }, { month: 'Mar', placements: 8 },
];

export default function Reports() {
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [jobOrders, setJobOrders] = useState<JobOrder[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [companies, setCompanies] = useState<ClientCompany[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);

  useEffect(() => {
    initializeData();
    setPlacements(storage.get<Placement[]>('fnj_placements') || []);
    setJobOrders(storage.get<JobOrder[]>('fnj_job_orders') || []);
    setCandidates(storage.get<Candidate[]>('fnj_candidates') || []);
    setCompanies(storage.get<ClientCompany[]>('fnj_companies') || []);
    setInterviews(storage.get<Interview[]>('fnj_interviews') || []);
  }, []);

  const totalPlacements = placements.length;

  const filledOrders = jobOrders.filter(j => j.status === 'filled').length;
  const fillRate = jobOrders.length > 0 ? Math.round((filledOrders / jobOrders.length) * 100) : 0;

  const timeToFillDays = jobOrders
    .filter(j => j.status === 'filled' && j.filledAt && j.openedAt)
    .map(j => {
      const opened = new Date(j.openedAt).getTime();
      const filled = new Date(j.filledAt!).getTime();
      return (filled - opened) / (1000 * 60 * 60 * 24);
    });
  const avgTimeToFill = timeToFillDays.length > 0
    ? Math.round(timeToFillDays.reduce((a, b) => a + b, 0) / timeToFillDays.length)
    : 0;

  const getMonthlyData = () => {
    if (placements.length === 0) return MOCK_MONTHLY_DATA;
    const monthly: Record<string, number> = {};
    placements.forEach(p => {
      const date = new Date(p.placedAt);
      const key = date.toLocaleString('en-US', { month: 'short' });
      monthly[key] = (monthly[key] || 0) + 1;
    });
    return Object.entries(monthly)
      .slice(-6)
      .map(([month, placements]) => ({ month, placements }))
      .reverse()
      .concat(MOCK_MONTHLY_DATA.slice(0, Math.max(0, 6 - Object.keys(monthly).length)))
      .reverse();
  };

  const getIndustryBreakdown = () => {
    if (placements.length === 0) {
      return [
        { name: 'Healthcare', value: 35 }, { name: 'IT', value: 20 },
        { name: 'Hospitality', value: 18 }, { name: 'Manufacturing', value: 15 },
        { name: 'Other', value: 12 },
      ];
    }
    const industryCount: Record<string, number> = {};
    placements.forEach(p => {
      industryCount[p.industry] = (industryCount[p.industry] || 0) + 1;
    });
    const total = placements.length;
    return Object.entries(industryCount).map(([name, count]) => ({
      name,
      value: Math.round((count / total) * 100),
    }));
  };

  const totalCandidates = candidates.length;
  const interviewedCandidates = new Set(interviews.map(i => i.candidateId)).size;
  const placedCandidates = candidates.filter(c => c.status === 'placed').length;

  const pipelineData = [
    { stage: 'Total Candidates', count: totalCandidates },
    { stage: 'Interviewed', count: interviewedCandidates },
    { stage: 'Placed', count: placedCandidates },
  ];

  const availableCount = candidates.filter(c => c.status === 'available').length;
  const interviewingCount = candidates.filter(c => c.status === 'interviewing').length;
  const inactiveCount = candidates.filter(c => c.status === 'inactive').length;

  const topCompanies = [...companies]
    .sort((a, b) => b.totalPlacements - a.totalPlacements)
    .slice(0, 5);

  const getLastActivity = (company: ClientCompany) => {
    const companyPlacements = placements.filter(p => p.clientId === company.id);
    const companyOrders = jobOrders.filter(j => j.clientId === company.id);
    const dates = [
      ...companyPlacements.map(p => new Date(p.placedAt).getTime()),
      ...companyOrders.map(j => new Date(j.openedAt).getTime()),
    ];
    if (dates.length === 0) return 'No activity';
    const latest = Math.max(...dates);
    return new Date(latest).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <AdminLayout>
      <Topbar title="Reports" subtitle="Analytics and insights" />
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="lg:col-span-2 bg-white rounded-xl border border-[#E4E0D8] p-6">
            <h3 className="font-black uppercase text-sm text-[#16201C] tracking-tight mb-4">Placement Stats</h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <div className="bg-[#F9F8F5] rounded-lg p-4">
                <p className="text-xs text-[#9CA3AF] uppercase tracking-wider">Total Placements</p>
                <p className="text-3xl font-black text-[#16201C] mt-1">{totalPlacements}</p>
              </div>
              <div className="bg-[#F9F8F5] rounded-lg p-4">
                <p className="text-xs text-[#9CA3AF] uppercase tracking-wider">Fill Rate</p>
                <p className="text-3xl font-black text-[#16201C] mt-1">{fillRate}%</p>
              </div>
              <div className="bg-[#F9F8F5] rounded-lg p-4">
                <p className="text-xs text-[#9CA3AF] uppercase tracking-wider">Avg. Time to Fill</p>
                <p className="text-3xl font-black text-[#16201C] mt-1">{avgTimeToFill}d</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={getMonthlyData()} barCategoryGap="30%">
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E4E0D8', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="placements" fill="#0E5C3F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border border-[#E4E0D8] p-6">
            <h3 className="font-black uppercase text-sm text-[#16201C] tracking-tight mb-4">Industry Breakdown</h3>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={getIndustryBreakdown()} cx="50%" cy="50%" outerRadius={75} dataKey="value" strokeWidth={0}>
                  {getIndustryBreakdown().map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E4E0D8', borderRadius: '8px', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {getIndustryBreakdown().map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="text-xs text-[#6B7280]">{item.name}</span>
                  </div>
                  <span className="text-xs font-bold text-[#16201C]">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E4E0D8] p-6">
            <h3 className="font-black uppercase text-sm text-[#16201C] tracking-tight mb-4">Candidate Pipeline</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={pipelineData} layout="vertical" barCategoryGap="20%">
                <XAxis type="number" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="stage" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} width={100} />
                <Tooltip contentStyle={{ background: '#fff', border: '1px solid #E4E0D8', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="count" fill="#0E5C3F" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-[#F9F8F5] rounded-lg p-3 text-center">
                <p className="text-lg font-black text-[#16201C]">{availableCount}</p>
                <p className="text-[10px] uppercase tracking-wider text-[#9CA3AF]">Available</p>
              </div>
              <div className="bg-[#F9F8F5] rounded-lg p-3 text-center">
                <p className="text-lg font-black text-[#16201C]">{interviewingCount}</p>
                <p className="text-[10px] uppercase tracking-wider text-[#9CA3AF]">Interviewing</p>
              </div>
              <div className="bg-[#F9F8F5] rounded-lg p-3 text-center">
                <p className="text-lg font-black text-[#16201C]">{placedCandidates}</p>
                <p className="text-[10px] uppercase tracking-wider text-[#9CA3AF]">Placed</p>
              </div>
              <div className="bg-[#F9F8F5] rounded-lg p-3 text-center">
                <p className="text-lg font-black text-[#16201C]">{inactiveCount}</p>
                <p className="text-[10px] uppercase tracking-wider text-[#9CA3AF]">Inactive</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl border border-[#E4E0D8] p-6">
            <h3 className="font-black uppercase text-sm text-[#16201C] tracking-tight mb-4">Top Client Companies</h3>
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E4E0D8]">
                  <th className="text-left text-[10px] font-black uppercase tracking-wider text-[#9CA3AF] pb-3 pr-4">Rank</th>
                  <th className="text-left text-[10px] font-black uppercase tracking-wider text-[#9CA3AF] pb-3 pr-4">Company</th>
                  <th className="text-left text-[10px] font-black uppercase tracking-wider text-[#9CA3AF] pb-3 pr-4">Industry</th>
                  <th className="text-left text-[10px] font-black uppercase tracking-wider text-[#9CA3AF] pb-3 pr-4">Placements</th>
                  <th className="text-left text-[10px] font-black uppercase tracking-wider text-[#9CA3AF] pb-3">Last Activity</th>
                </tr>
              </thead>
              <tbody>
                {topCompanies.map((company, i) => (
                  <tr key={company.id} className="bg-white border-b border-[#E4E0D8] hover:bg-[#F9F8F5] transition-colors">
                    <td className="py-3 pr-4 text-sm font-black text-[#0E5C3F]">{i + 1}</td>
                    <td className="py-3 pr-4 text-sm font-bold text-[#16201C]">{company.name}</td>
                    <td className="py-3 pr-4 text-xs text-[#6B7280]">{company.industry}</td>
                    <td className="py-3 pr-4 text-sm font-bold text-[#16201C]">{company.totalPlacements}</td>
                    <td className="py-3 text-xs text-[#6B7280]">{getLastActivity(company)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}