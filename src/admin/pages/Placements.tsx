import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, ChevronDown } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import Topbar from '../components/layout/Topbar';
import SlidePanel from '../components/ui/SlidePanel';
import StatusBadge from '../components/ui/StatusBadge';
import { storage } from '../utils/storage';
import { initializeData, type Placement, type Candidate, type ClientCompany, type JobOrder, type ActivityEntry } from '../data/seed';

const FILTERS = ['All', 'Active', 'Completed', 'Terminated', 'Converted'];
const TYPE_OPTIONS = ['temporary', 'temp_to_hire', 'direct_hire', 'contract'];
const STATUS_OPTIONS = ['active', 'completed', 'terminated', 'converted'];

const getNextPlacementId = (placements: Placement[]): string => {
  const nums = placements.map(p => parseInt(p.id.replace('PLC-', ''), 10)).filter(n => !isNaN(n));
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return `PLC-${String(max + 1).padStart(3, '0')}`;
};

const toast = (message: string) => {
  const el = document.createElement('div');
  el.textContent = message;
  el.className = 'fixed bottom-4 right-4 bg-[#0E5C3F] text-white text-xs font-bold px-5 py-3 rounded-lg shadow-xl z-[100] animate-fade-in';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
};

export default function Placements() {
  const navigate = useNavigate();
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [companies, setCompanies] = useState<ClientCompany[]>([]);
  const [jobOrders, setJobOrders] = useState<JobOrder[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPanel, setShowPanel] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [form, setForm] = useState({
    candidateId: '',
    clientId: '',
    jobOrderId: '',
    role: '',
    industry: '',
    type: 'temporary' as Placement['type'],
    status: 'active' as Placement['status'],
    startDate: '',
    endDate: '',
    payRate: '',
    notes: '',
  });

  useEffect(() => {
    initializeData();
    setPlacements(storage.get<Placement[]>('fnj_placements') || []);
    setCandidates(storage.get<Candidate[]>('fnj_candidates') || []);
    setCompanies(storage.get<ClientCompany[]>('fnj_companies') || []);
    setJobOrders(storage.get<JobOrder[]>('fnj_job_orders') || []);
  }, []);

  const filtered = placements.filter(p => {
    const filterMatch = activeFilter === 'All' || p.status === activeFilter.toLowerCase();
    const q = searchQuery.toLowerCase();
    const searchMatch = !q ||
      p.candidateName.toLowerCase().includes(q) ||
      p.clientName.toLowerCase().includes(q) ||
      p.role.toLowerCase().includes(q);
    return filterMatch && searchMatch;
  });

  const openJobOrders = jobOrders.filter(j => j.status === 'open' || j.status === 'in_progress');

  const handleFieldChange = (field: string, value: string) => {
    setForm(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'jobOrderId' && value) {
        const jo = jobOrders.find(j => j.id === value);
        if (jo) {
          updated.role = jo.title;
          updated.industry = jo.industry;
          updated.payRate = jo.payRate;
        }
      }
      return updated;
    });
  };

  const handleSave = () => {
    if (!form.candidateId || !form.clientId || !form.jobOrderId || !form.startDate) {
      toast('Please fill in all required fields.');
      return;
    }

    const candidate = candidates.find(c => c.id === form.candidateId);
    const company = companies.find(c => c.id === form.clientId);
    const jo = jobOrders.find(j => j.id === form.jobOrderId);
    if (!candidate || !company || !jo) return;

    const newPlacement: Placement = {
      id: getNextPlacementId(placements),
      candidateId: form.candidateId,
      candidateName: `${candidate.firstName} ${candidate.lastName}`,
      clientId: form.clientId,
      clientName: company.name,
      jobOrderId: form.jobOrderId,
      role: form.role || jo.title,
      industry: form.industry || jo.industry,
      type: form.type,
      status: form.status,
      startDate: form.startDate,
      endDate: form.endDate || null,
      payRate: form.payRate || jo.payRate,
      notes: form.notes,
      placedAt: new Date().toISOString(),
    };

    const updatedPlacements = [...placements, newPlacement];
    setPlacements(updatedPlacements);
    storage.set('fnj_placements', updatedPlacements);

    const updatedJobOrders = jobOrders.map(j =>
      j.id === form.jobOrderId
        ? { ...j, status: 'filled' as const, filledAt: new Date().toISOString(), candidateId: form.candidateId, candidateName: newPlacement.candidateName }
        : j
    );
    setJobOrders(updatedJobOrders);
    storage.set('fnj_job_orders', updatedJobOrders);

    const updatedCandidates = candidates.map(c =>
      c.id === form.candidateId ? { ...c, status: 'placed' as const } : c
    );
    setCandidates(updatedCandidates);
    storage.set('fnj_candidates', updatedCandidates);

    const activity: ActivityEntry[] = storage.get<ActivityEntry[]>('fnj_activity') || [];
    const newActivity: ActivityEntry = {
      id: `ACT-${String(activity.length + 1).padStart(3, '0')}`,
      type: 'placement_created',
      description: `Placement: ${newPlacement.candidateName} → ${newPlacement.clientName}`,
      timestamp: new Date().toISOString(),
      entityId: newPlacement.id,
      entityType: 'placement',
    };
    storage.set('fnj_activity', [...activity, newActivity]);

    setForm({
      candidateId: '', clientId: '', jobOrderId: '',
      role: '', industry: '', type: 'temporary', status: 'active',
      startDate: '', endDate: '', payRate: '', notes: '',
    });
    setShowPanel(false);
    toast('Placement created successfully');
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <AdminLayout>
      <Topbar title="Placements" />

      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors whitespace-nowrap ${
                  activeFilter === f
                    ? 'bg-white text-[#16201C] shadow-sm'
                    : 'text-[#6B7280] hover:text-[#16201C]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Search candidate, company, role..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm bg-white border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors w-64"
              />
            </div>

            <button
              onClick={() => setShowPanel(true)}
              className="bg-[#0E5C3F] text-white font-black uppercase text-xs px-5 py-2.5 rounded-lg hover:bg-[#073D29] transition-colors flex items-center gap-2"
            >
              <Plus size={14} />
              New Placement
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E4E0D8] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F9F8F5] text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold">
                <th className="text-left px-4 py-3">ID</th>
                <th className="text-left px-4 py-3">Candidate</th>
                <th className="text-left px-4 py-3">Company</th>
                <th className="text-left px-4 py-3">Role</th>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Start Date</th>
                <th className="text-left px-4 py-3">End Date</th>
                <th className="text-left px-4 py-3">Pay Rate</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-sm text-[#9CA3AF]">
                    No placements found
                  </td>
                </tr>
              ) : (
                filtered.map(p => (
                  <tr key={p.id} className="border-t border-[#E4E0D8] hover:bg-[#F9F8F5] transition-colors">
                    <td className="px-4 py-3 text-xs text-[#9CA3AF] font-mono">{p.id}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => navigate(`/admin/candidates/${p.candidateId}`)}
                        className="text-sm font-bold text-[#16201C] hover:text-[#0E5C3F] transition-colors"
                      >
                        {p.candidateName}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-bold text-[#16201C]">{p.clientName}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#6B7280]">{p.role}</td>
                    <td className="px-4 py-3"><StatusBadge status={p.type} size="sm" /></td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} size="sm" /></td>
                    <td className="px-4 py-3 text-xs text-[#9CA3AF]">{formatDate(p.startDate)}</td>
                    <td className="px-4 py-3 text-xs text-[#9CA3AF]">{p.endDate ? formatDate(p.endDate) : '—'}</td>
                    <td className="px-4 py-3 text-xs text-[#16201C] font-medium">{p.payRate}</td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === p.id ? null : p.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <ChevronDown size={14} className="text-[#6B7280]" />
                        </button>
                        {openMenuId === p.id && (
                          <div className="absolute right-0 top-8 w-36 bg-white border border-[#E4E0D8] rounded-lg shadow-lg z-20 py-1">
                            <button
                              onClick={() => navigate(`/admin/candidates/${p.candidateId}`)}
                              className="w-full px-3 py-2 text-xs text-left text-[#16201C] hover:bg-[#F9F8F5]"
                            >
                              View Candidate
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="New Placement">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-[#6B7280] mb-1.5">Candidate *</label>
            <select
              value={form.candidateId}
              onChange={e => handleFieldChange('candidateId', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] bg-white"
            >
              <option value="">Select candidate...</option>
              {candidates.map(c => (
                <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#6B7280] mb-1.5">Company *</label>
            <select
              value={form.clientId}
              onChange={e => handleFieldChange('clientId', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] bg-white"
            >
              <option value="">Select company...</option>
              {companies.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#6B7280] mb-1.5">Job Order *</label>
            <select
              value={form.jobOrderId}
              onChange={e => handleFieldChange('jobOrderId', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] bg-white"
            >
              <option value="">Select job order...</option>
              {openJobOrders.map(j => (
                <option key={j.id} value={j.id}>{j.title} — {j.clientName}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#6B7280] mb-1.5">Role</label>
              <input
                type="text"
                value={form.role}
                onChange={e => handleFieldChange('role', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#6B7280] mb-1.5">Industry</label>
              <input
                type="text"
                value={form.industry}
                onChange={e => handleFieldChange('industry', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#6B7280] mb-1.5">Type</label>
              <select
                value={form.type}
                onChange={e => handleFieldChange('type', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] bg-white"
              >
                {TYPE_OPTIONS.map(t => (
                  <option key={t} value={t}>{t.replace('_', '-')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#6B7280] mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={e => handleFieldChange('status', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] bg-white"
              >
                {STATUS_OPTIONS.map(s => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#6B7280] mb-1.5">Start Date *</label>
              <input
                type="date"
                value={form.startDate}
                onChange={e => handleFieldChange('startDate', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#6B7280] mb-1.5">End Date</label>
              <input
                type="date"
                value={form.endDate}
                onChange={e => handleFieldChange('endDate', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#6B7280] mb-1.5">Pay Rate</label>
            <input
              type="text"
              value={form.payRate}
              onChange={e => handleFieldChange('payRate', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F]"
              placeholder="e.g. $45/hr or $60,000/yr"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#6B7280] mb-1.5">Notes</label>
            <textarea
              value={form.notes}
              onChange={e => handleFieldChange('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] resize-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowPanel(false)}
              className="flex-1 px-4 py-2.5 text-sm font-bold text-[#6B7280] border border-[#E4E0D8] rounded-lg hover:bg-[#F9F8F5] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!form.candidateId || !form.clientId || !form.jobOrderId || !form.startDate}
              className="flex-1 px-4 py-2.5 text-sm font-bold bg-[#0E5C3F] text-white rounded-lg hover:bg-[#073D29] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Placement
            </button>
          </div>
        </div>
      </SlidePanel>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>
    </AdminLayout>
  );
}