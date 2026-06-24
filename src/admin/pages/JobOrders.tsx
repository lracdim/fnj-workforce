import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import Topbar from '../components/layout/Topbar';
import StatusBadge from '../components/ui/StatusBadge';
import SlidePanel from '../components/ui/SlidePanel';
import { storage } from '../utils/storage';
import { initializeData, type JobOrder, type ClientCompany, type ActivityEntry } from '../data/seed';

const INDUSTRIES = ['Healthcare', 'Information Technology', 'Hospitality', 'Manufacturing', 'Transportation', 'Construction', 'Administrative', 'Education', 'Retail'];
const TYPES = ['temporary', 'temp_to_hire', 'direct_hire', 'contract'];
const PRIORITIES = ['urgent', 'standard', 'low'];
const STATUS_TABS = ['All', 'Open', 'In Progress', 'Filled', 'Cancelled'];

const PRIORITY_COLORS: Record<string, { dot: string; label: string }> = {
  urgent: { dot: 'bg-red-500', label: 'Urgent' },
  standard: { dot: 'bg-[#0E5C3F]', label: 'Standard' },
  low: { dot: 'bg-[#9CA3AF]', label: 'Low' },
};

const getNextJobId = (orders: JobOrder[]): string => {
  const nums = orders
    .map(o => parseInt(o.id.replace('JOB-', ''), 10))
    .filter(n => !isNaN(n));
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return `JOB-${String(max + 1).padStart(3, '0')}`;
};

const toast = (message: string) => {
  const el = document.createElement('div');
  el.textContent = message;
  el.className = 'fixed bottom-4 right-4 bg-[#16201C] text-white text-xs font-bold px-4 py-3 rounded-lg shadow-xl z-[100] animate-fade-in';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
};

export default function JobOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<JobOrder[]>([]);
  const [companies, setCompanies] = useState<ClientCompany[]>([]);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [form, setForm] = useState({
    clientId: '', title: '', industry: 'Healthcare', type: 'temporary' as JobOrder['type'],
    priority: 'standard' as JobOrder['priority'], location: '', payRate: '', startDate: '',
    description: '', requirements: '', notes: '',
  });

  useEffect(() => {
    initializeData();
    setOrders(storage.get<JobOrder[]>('fnj_job_orders') || []);
    setCompanies(storage.get<ClientCompany[]>('fnj_companies') || []);
    setActivity(storage.get<ActivityEntry[]>('fnj_activity') || []);
  }, []);

  const filtered = orders.filter(o => {
    const tabMatch =
      activeTab === 'All' ? true :
      activeTab === 'Open' ? o.status === 'open' :
      activeTab === 'In Progress' ? o.status === 'in_progress' :
      activeTab === 'Filled' ? o.status === 'filled' :
      o.status === 'cancelled';
    const q = search.toLowerCase();
    const searchMatch = !q ||
      o.title.toLowerCase().includes(q) ||
      o.clientName.toLowerCase().includes(q) ||
      o.industry.toLowerCase().includes(q);
    return tabMatch && searchMatch;
  });

  const handleSave = () => {
    if (!form.title || !form.clientId) {
      toast('Please fill in required fields.');
      return;
    }
    const client = companies.find(c => c.id === form.clientId);
    const newId = getNextJobId(orders);
    const now = new Date().toISOString();
    const newOrder: JobOrder = {
      id: newId, clientId: form.clientId, clientName: client?.name || '',
      title: form.title, industry: form.industry, type: form.type,
      priority: form.priority, location: form.location, payRate: form.payRate,
      startDate: form.startDate, description: form.description,
      requirements: form.requirements.split(',').map(r => r.trim()).filter(Boolean),
      openedAt: now, filledAt: null, candidateId: null, candidateName: null, status: 'open', notes: '',
    };
    const updated = [...orders, newOrder];
    setOrders(updated);
    storage.set('fnj_job_orders', updated);

    const actEntry: ActivityEntry = {
      id: `ACT-${Date.now()}`, type: 'job_order_opened',
      description: `New job order: ${form.title} at ${client?.name || ''}`,
      timestamp: now, entityId: newId, entityType: 'job_order',
    };
    const updatedAct = [actEntry, ...activity];
    setActivity(updatedAct);
    storage.set('fnj_activity', updatedAct);

    toast('Job order created successfully!');
    setPanelOpen(false);
    setForm({ clientId: '', title: '', industry: 'Healthcare', type: 'temporary', priority: 'standard', location: '', payRate: '', startDate: '', description: '', requirements: '', notes: '' });
  };

  return (
    <AdminLayout>
      <Topbar title="Job Orders" />
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1 bg-white border border-[#E4E0D8] rounded-lg p-1">
            {STATUS_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${activeTab === tab ? 'bg-[#16201C] text-white' : 'text-[#6B7280] hover:bg-[#F9F8F5]'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Search title, client, industry..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm bg-white border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors w-64"
              />
            </div>
            <button
              onClick={() => setPanelOpen(true)}
              className="flex items-center gap-2 bg-[#0E5C3F] hover:bg-[#073D29] text-white font-black uppercase text-xs tracking-wider px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={14} /> New Job Order
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E4E0D8] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F9F8F5]">
                <th className="text-left px-4 py-3 text-[10px] uppercase text-[#9CA3AF] font-bold tracking-wider">ID</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase text-[#9CA3AF] font-bold tracking-wider">Title</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase text-[#9CA3AF] font-bold tracking-wider">Client</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase text-[#9CA3AF] font-bold tracking-wider">Type</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase text-[#9CA3AF] font-bold tracking-wider">Priority</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase text-[#9CA3AF] font-bold tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase text-[#9CA3AF] font-bold tracking-wider">Start Date</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase text-[#9CA3AF] font-bold tracking-wider">Candidate</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-sm text-[#9CA3AF]">No job orders found.</td></tr>
              ) : filtered.map(order => (
                <tr
                  key={order.id}
                  onClick={() => navigate(`/admin/job-orders/${order.id}`)}
                  className="hover:bg-[#F9F8F5] border-t border-[#E4E0D8] cursor-pointer transition-colors"
                >
                  <td className="px-4 py-4 text-xs font-mono text-[#6B7280]">{order.id}</td>
                  <td className="px-4 py-4 text-sm font-bold text-[#16201C]">{order.title}</td>
                  <td className="px-4 py-4 text-sm text-[#6B7280]">{order.clientName}</td>
                  <td className="px-4 py-4"><StatusBadge status={order.type} size="sm" /></td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B7280]">
                      <span className={`w-2 h-2 rounded-full ${PRIORITY_COLORS[order.priority].dot}`} />
                      {PRIORITY_COLORS[order.priority].label}
                    </span>
                  </td>
                  <td className="px-4 py-4"><StatusBadge status={order.status} size="sm" /></td>
                  <td className="px-4 py-4 text-xs text-[#6B7280]">{order.startDate ? new Date(order.startDate).toLocaleDateString() : '—'}</td>
                  <td className="px-4 py-4 text-xs text-[#6B7280]">{order.candidateName || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SlidePanel open={panelOpen} onClose={() => setPanelOpen(false)} title="New Job Order">
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#6B7280] tracking-wider mb-1.5">Client *</label>
            <select
              value={form.clientId}
              onChange={e => setForm({ ...form, clientId: e.target.value })}
              className="w-full border border-[#E4E0D8] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0E5C3F]"
            >
              <option value="">Select client...</option>
              {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#6B7280] tracking-wider mb-1.5">Title *</label>
            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full border border-[#E4E0D8] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0E5C3F]" placeholder="e.g. Registered Nurse — ICU" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#6B7280] tracking-wider mb-1.5">Industry</label>
              <select value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })}
                className="w-full border border-[#E4E0D8] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0E5C3F]">
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#6B7280] tracking-wider mb-1.5">Type</label>
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as JobOrder['type'] })}
                className="w-full border border-[#E4E0D8] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0E5C3F]">
                {TYPES.map(t => <option key={t} value={t}>{t.replace('_', '-')}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#6B7280] tracking-wider mb-1.5">Priority</label>
              <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as JobOrder['priority'] })}
                className="w-full border border-[#E4E0D8] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0E5C3F]">
                {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#6B7280] tracking-wider mb-1.5">Start Date</label>
              <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })}
                className="w-full border border-[#E4E0D8] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0E5C3F]" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#6B7280] tracking-wider mb-1.5">Location</label>
            <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
              className="w-full border border-[#E4E0D8] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0E5C3F]" placeholder="City, State" />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#6B7280] tracking-wider mb-1.5">Pay Rate</label>
            <input type="text" value={form.payRate} onChange={e => setForm({ ...form, payRate: e.target.value })}
              className="w-full border border-[#E4E0D8] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0E5C3F]" placeholder="$45–$55/hr" />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#6B7280] tracking-wider mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3}
              className="w-full border border-[#E4E0D8] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0E5C3F] resize-none" placeholder="Job description..." />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#6B7280] tracking-wider mb-1.5">Requirements <span className="normal-case font-normal">(comma-separated)</span></label>
            <textarea value={form.requirements} onChange={e => setForm({ ...form, requirements: e.target.value })} rows={2}
              className="w-full border border-[#E4E0D8] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0E5C3F] resize-none" placeholder="RN License, 2+ years experience, BLS..." />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#6B7280] tracking-wider mb-1.5">Notes</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2}
              className="w-full border border-[#E4E0D8] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0E5C3F] resize-none" placeholder="Internal notes..." />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave}
              className="flex-1 bg-[#0E5C3F] hover:bg-[#073D29] text-white font-black uppercase text-xs tracking-wider py-3 rounded-lg transition-colors">
              Create Job Order
            </button>
            <button onClick={() => setPanelOpen(false)}
              className="px-6 border border-[#E4E0D8] text-[#6B7280] font-bold uppercase text-xs tracking-wider py-3 rounded-lg hover:bg-[#F9F8F5] transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </SlidePanel>
    </AdminLayout>
  );
}