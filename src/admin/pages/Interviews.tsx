import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import Topbar from '../components/layout/Topbar';
import StatusBadge from '../components/ui/StatusBadge';
import SlidePanel from '../components/ui/SlidePanel';
import { storage } from '../utils/storage';
import { initializeData, type Interview, type Candidate, type ClientCompany, type JobOrder, type ActivityEntry } from '../data/seed';

const STATUS_TABS = ['All', 'Scheduled', 'Completed', 'Cancelled'];
const INTERVIEW_TYPES = ['phone', 'video', 'in_person'] as const;

const toast = (message: string, action?: { label: string; onClick: () => void }) => {
  const container = document.createElement('div');
  container.className = 'fixed bottom-4 right-4 bg-[#0E5C3F] text-white text-xs font-bold px-4 py-3 rounded-lg shadow-xl z-[100] animate-fade-in';
  
  const msgEl = document.createElement('p');
  msgEl.className = 'text-sm font-bold';
  msgEl.textContent = message;
  container.appendChild(msgEl);
  
  if (action) {
    const btn = document.createElement('button');
    btn.className = 'mt-2 text-xs underline hover:no-underline text-[#0E5C3F]';
    btn.textContent = action.label;
    btn.onclick = () => {
      action.onClick();
      container.remove();
    };
    container.appendChild(btn);
  }
  
  document.body.appendChild(container);
  setTimeout(() => container.remove(), 5000);
};

const getNextInterviewId = (interviews: Interview[]): string => {
  const nums = interviews
    .map(i => parseInt(i.id.replace('INT-', ''), 10))
    .filter(n => !isNaN(n));
  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return `INT-${String(max + 1).padStart(3, '0')}`;
};

const formatInterviewDate = (iso: string) => {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).replace(',', ' at');
};

export default function Interviews() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [companies, setCompanies] = useState<ClientCompany[]>([]);
  const [jobOrders, setJobOrders] = useState<JobOrder[]>([]);
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const [form, setForm] = useState({
    candidateId: '',
    clientId: '',
    jobOrderId: '',
    scheduledAt: '',
    type: 'video' as Interview['type'],
    notes: '',
  });

  useEffect(() => {
    initializeData();
    setInterviews(storage.get<Interview[]>('fnj_interviews') || []);
    setCandidates(storage.get<Candidate[]>('fnj_candidates') || []);
    setCompanies(storage.get<ClientCompany[]>('fnj_companies') || []);
    setJobOrders(storage.get<JobOrder[]>('fnj_job_orders') || []);
  }, []);

  const filteredCandidates = candidates.filter(c => 
    c.status !== 'placed' && c.status !== 'inactive'
  );

  const filteredJobOrders = jobOrders.filter(jo => 
    form.clientId === '' || jo.clientId === form.clientId
  );

  const selectedJobOrder = jobOrders.find(jo => jo.id === form.jobOrderId);

  const filtered = interviews.filter(interview => {
    const tabMatch =
      activeTab === 'All' ? true :
      activeTab === 'Scheduled' ? interview.status === 'scheduled' :
      activeTab === 'Completed' ? interview.status === 'completed' :
      interview.status === 'cancelled';
    const q = search.toLowerCase();
    const searchMatch = !q ||
      interview.candidateName.toLowerCase().includes(q) ||
      interview.clientName.toLowerCase().includes(q) ||
      interview.role.toLowerCase().includes(q);
    return tabMatch && searchMatch;
  });

  const handleSave = () => {
    if (!form.candidateId || !form.clientId || !form.jobOrderId || !form.scheduledAt) {
      toast('Please fill in required fields.');
      return;
    }

    const candidate = candidates.find(c => c.id === form.candidateId);
    const company = companies.find(c => c.id === form.clientId);
    const jobOrder = jobOrders.find(jo => jo.id === form.jobOrderId);

    const newInterview: Interview = {
      id: getNextInterviewId(interviews),
      candidateId: form.candidateId,
      candidateName: candidate ? `${candidate.firstName} ${candidate.lastName}` : '',
      clientId: form.clientId,
      clientName: company?.name || '',
      jobOrderId: form.jobOrderId,
      role: jobOrder?.title || '',
      scheduledAt: new Date(form.scheduledAt).toISOString(),
      type: form.type,
      status: 'scheduled',
      notes: form.notes,
      outcome: 'pending',
    };

    const updated = [...interviews, newInterview];
    setInterviews(updated);
    storage.set('fnj_interviews', updated);

    const activity: ActivityEntry[] = storage.get<ActivityEntry[]>('fnj_activity') || [];
    const newActivity: ActivityEntry = {
      id: `ACT-${Date.now()}`,
      type: 'interview_scheduled',
      description: `Interview scheduled: ${newInterview.candidateName} → ${newInterview.clientName}`,
      timestamp: new Date().toISOString(),
      entityId: newInterview.id,
      entityType: 'interview',
    };
    storage.set('fnj_activity', [newActivity, ...activity]);

    toast('Interview scheduled successfully!');
    setPanelOpen(false);
    setForm({ candidateId: '', clientId: '', jobOrderId: '', scheduledAt: '', type: 'video', notes: '' });
  };

  const handleOutcome = (interview: Interview, outcome: 'passed' | 'failed') => {
    const updated = interviews.map(i =>
      i.id === interview.id ? { ...i, outcome, status: outcome === 'passed' ? 'completed' as const : i.status } : i
    );
    setInterviews(updated);
    storage.set('fnj_interviews', updated);

    const activity: ActivityEntry[] = storage.get<ActivityEntry[]>('fnj_activity') || [];
    const newActivity: ActivityEntry = {
      id: `ACT-${Date.now()}`,
      type: outcome === 'passed' ? 'placement_created' : 'status_changed',
      description: `Interview ${outcome}: ${interview.candidateName} → ${interview.clientName}`,
      timestamp: new Date().toISOString(),
      entityId: interview.id,
      entityType: 'interview',
    };
    storage.set('fnj_activity', [newActivity, ...activity]);

    if (outcome === 'passed') {
      toast('Interview passed! Consider creating a placement →', {
        label: 'Create Placement →',
        onClick: () => navigate('/admin/placements'),
      });
    } else {
      toast('Interview marked as failed.');
    }
  };

  const handleCancel = (interview: Interview) => {
    const updated = interviews.map(i =>
      i.id === interview.id ? { ...i, status: 'cancelled' as const } : i
    );
    setInterviews(updated);
    storage.set('fnj_interviews', updated);

    const activity: ActivityEntry[] = storage.get<ActivityEntry[]>('fnj_activity') || [];
    const newActivity: ActivityEntry = {
      id: `ACT-${Date.now()}`,
      type: 'status_changed',
      description: `Interview cancelled: ${interview.candidateName} → ${interview.clientName}`,
      timestamp: new Date().toISOString(),
      entityId: interview.id,
      entityType: 'interview',
    };
    storage.set('fnj_activity', [newActivity, ...activity]);

    toast('Interview cancelled.');
  };

  return (
    <AdminLayout>
      <Topbar title="Interviews" />
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1 bg-white border border-[#E4E0D8] rounded-lg p-1">
            {STATUS_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${
                  activeTab === tab ? 'bg-[#16201C] text-white' : 'text-[#6B7280] hover:bg-[#F9F8F5]'
                }`}
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
                placeholder="Search candidate, company, role..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm bg-white border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors w-64"
              />
            </div>
            <button
              onClick={() => setPanelOpen(true)}
              className="flex items-center gap-2 bg-[#0E5C3F] hover:bg-[#073D29] text-white font-black uppercase text-xs tracking-wider px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={14} /> Schedule Interview
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
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Outcome</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-sm text-[#9CA3AF]">
                    No interviews found
                  </td>
                </tr>
              ) : filtered.map(interview => (
                <tr
                  key={interview.id}
                  className="border-t border-[#E4E0D8] hover:bg-[#F9F8F5] transition-colors"
                >
                  <td className="px-4 py-3 text-xs font-mono text-[#6B7280]">{interview.id}</td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-bold text-[#16201C] cursor-pointer hover:text-[#0E5C3F]">
                      {interview.candidateName}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-bold text-[#16201C]">{interview.clientName}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#6B7280]">{interview.role}</td>
                  <td className="px-4 py-3"><StatusBadge status={interview.type} size="sm" /></td>
                  <td className="px-4 py-3 text-xs text-[#6B7280]">{formatInterviewDate(interview.scheduledAt)}</td>
                  <td className="px-4 py-3"><StatusBadge status={interview.status} size="sm" /></td>
                  <td className="px-4 py-3"><StatusBadge status={interview.outcome} size="sm" /></td>
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      {interview.status === 'scheduled' && interview.outcome === 'pending' && (
                        <>
                          <button
                            onClick={() => handleOutcome(interview, 'passed')}
                            className="px-2 py-1 text-[10px] font-bold border border-green-600 text-green-600 rounded hover:bg-green-50 transition-colors"
                          >
                            Passed
                          </button>
                          <button
                            onClick={() => handleOutcome(interview, 'failed')}
                            className="px-2 py-1 text-[10px] font-bold border border-red-600 text-red-600 rounded hover:bg-red-50 transition-colors"
                          >
                            Failed
                          </button>
                          <button
                            onClick={() => handleCancel(interview)}
                            className="px-2 py-1 text-[10px] font-bold border border-gray-400 text-gray-600 rounded hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SlidePanel open={panelOpen} onClose={() => setPanelOpen(false)} title="Schedule Interview">
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#6B7280] tracking-wider mb-1.5">Candidate *</label>
            <select
              value={form.candidateId}
              onChange={e => setForm({ ...form, candidateId: e.target.value })}
              className="w-full border border-[#E4E0D8] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0E5C3F] bg-white"
            >
              <option value="">Select candidate...</option>
              {filteredCandidates.map(c => (
                <option key={c.id} value={c.id}>{c.firstName} {c.lastName} ({c.role})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-[#6B7280] tracking-wider mb-1.5">Company *</label>
            <select
              value={form.clientId}
              onChange={e => setForm({ ...form, clientId: e.target.value, jobOrderId: '' })}
              className="w-full border border-[#E4E0D8] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0E5C3F] bg-white"
            >
              <option value="">Select company...</option>
              {companies.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-[#6B7280] tracking-wider mb-1.5">Job Order *</label>
            <select
              value={form.jobOrderId}
              onChange={e => setForm({ ...form, jobOrderId: e.target.value })}
              className="w-full border border-[#E4E0D8] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0E5C3F] bg-white"
              disabled={!form.clientId}
            >
              <option value="">Select job order...</option>
              {filteredJobOrders.map(jo => (
                <option key={jo.id} value={jo.id}>{jo.title}</option>
              ))}
            </select>
          </div>

          {selectedJobOrder && (
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#6B7280] tracking-wider mb-1.5">Role</label>
              <input
                type="text"
                value={selectedJobOrder.title}
                className="w-full border border-[#E4E0D8] rounded-lg px-3 py-2.5 text-sm bg-[#F9F8F5] text-[#6B7280]"
                readOnly
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold uppercase text-[#6B7280] tracking-wider mb-1.5">Scheduled Date & Time *</label>
            <input
              type="datetime-local"
              value={form.scheduledAt}
              onChange={e => setForm({ ...form, scheduledAt: e.target.value })}
              className="w-full border border-[#E4E0D8] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0E5C3F]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-[#6B7280] tracking-wider mb-1.5">Type</label>
            <select
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value as Interview['type'] })}
              className="w-full border border-[#E4E0D8] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0E5C3F] bg-white"
            >
              {INTERVIEW_TYPES.map(t => (
                <option key={t} value={t}>{t.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-[#6B7280] tracking-wider mb-1.5">Notes</label>
            <textarea
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="w-full border border-[#E4E0D8] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0E5C3F] resize-none"
              placeholder="Interview notes..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-[#0E5C3F] hover:bg-[#073D29] text-white font-black uppercase text-xs tracking-wider py-3 rounded-lg transition-colors"
            >
              Schedule Interview
            </button>
            <button
              onClick={() => setPanelOpen(false)}
              className="px-6 border border-[#E4E0D8] text-[#6B7280] font-bold uppercase text-xs tracking-wider py-3 rounded-lg hover:bg-[#F9F8F5] transition-colors"
            >
              Cancel
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