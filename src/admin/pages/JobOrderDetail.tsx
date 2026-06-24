import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import Topbar from '../components/layout/Topbar';
import StatusBadge from '../components/ui/StatusBadge';
import SlidePanel from '../components/ui/SlidePanel';
import { storage } from '../utils/storage';
import { initializeData, type JobOrder, type Candidate, type ActivityEntry } from '../data/seed';

const INDUSTRIES = ['Healthcare', 'Information Technology', 'Hospitality', 'Manufacturing', 'Transportation', 'Construction', 'Administrative', 'Education', 'Retail'];
const TYPES = ['temporary', 'temp_to_hire', 'direct_hire', 'contract'];
const PRIORITIES = ['urgent', 'standard', 'low'];
const PRIORITY_COLORS: Record<string, { dot: string; label: string }> = {
  urgent: { dot: 'bg-red-500', label: 'Urgent' },
  standard: { dot: 'bg-[#0E5C3F]', label: 'Standard' },
  low: { dot: 'bg-[#9CA3AF]', label: 'Low' },
};

const toast = (message: string) => {
  const el = document.createElement('div');
  el.textContent = message;
  el.className = 'fixed bottom-4 right-4 bg-[#16201C] text-white text-xs font-bold px-4 py-3 rounded-lg shadow-xl z-[100]';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
};

export default function JobOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<JobOrder | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({
    clientId: '', title: '', industry: 'Healthcare', type: 'temporary' as JobOrder['type'],
    priority: 'standard' as JobOrder['priority'], location: '', payRate: '', startDate: '',
    description: '', requirements: '', notes: '',
  });

  useEffect(() => {
    initializeData();
    const orders = storage.get<JobOrder[]>('fnj_job_orders') || [];
    const found = orders.find(o => o.id === id);
    setOrder(found || null);
    if (found) {
      setForm({
        clientId: found.clientId,
        title: found.title,
        industry: found.industry,
        type: found.type,
        priority: found.priority,
        location: found.location,
        payRate: found.payRate,
        startDate: found.startDate ? found.startDate.split('T')[0] : '',
        description: found.description,
        requirements: found.requirements.join(', '),
        notes: found.notes || '',
      });
    }
    setCandidates(storage.get<Candidate[]>('fnj_candidates') || []);
    setActivity(storage.get<ActivityEntry[]>('fnj_activity') || []);
  }, [id]);

  const addActivity = (type: ActivityEntry['type'], description: string, entityId: string) => {
    const entry: ActivityEntry = {
      id: `ACT-${Date.now()}`, type, description,
      timestamp: new Date().toISOString(), entityId, entityType: 'job_order',
    };
    const updated = [entry, ...activity];
    setActivity(updated);
    storage.set('fnj_activity', updated);
  };

  const updateOrder = (updated: JobOrder) => {
    const orders = storage.get<JobOrder[]>('fnj_job_orders') || [];
    const idx = orders.findIndex(o => o.id === updated.id);
    orders[idx] = updated;
    storage.set('fnj_job_orders', orders);
    setOrder(updated);
  };

  const handleStatusChange = (newStatus: JobOrder['status'], filledAt?: string | null) => {
    if (!order) return;
    const updated = { ...order, status: newStatus, ...(filledAt !== undefined ? { filledAt } : {}) };
    updateOrder(updated);
    const statusLabel = newStatus.replace('_', '-');
    addActivity('status_changed', `Job order ${order.id} status changed to ${statusLabel}`, order.id);
    toast(`Status updated to ${statusLabel}`);
  };

  const handleAssign = (candidate: Candidate) => {
    if (!order) return;
    const updated = {
      ...order,
      candidateId: candidate.id,
      candidateName: `${candidate.firstName} ${candidate.lastName}`,
      status: 'in_progress' as const,
    };
    updateOrder(updated);
    addActivity('status_changed', `Candidate ${candidate.firstName} ${candidate.lastName} assigned to ${order.id}`, order.id);
    toast(`${candidate.firstName} ${candidate.lastName} assigned!`);
  };

  const handleEditSave = () => {
    if (!order) return;
    const orders = storage.get<JobOrder[]>('fnj_job_orders') || [];
    const idx = orders.findIndex(o => o.id === order.id);
    const clientName = orders[idx]?.clientName || '';
    const updated: JobOrder = {
      ...order,
      clientId: form.clientId,
      clientName,
      title: form.title,
      industry: form.industry,
      type: form.type,
      priority: form.priority,
      location: form.location,
      payRate: form.payRate,
      startDate: form.startDate ? new Date(form.startDate).toISOString() : '',
      description: form.description,
      requirements: form.requirements.split(',').map(r => r.trim()).filter(Boolean),
    };
    orders[idx] = updated;
    storage.set('fnj_job_orders', orders);
    setOrder(updated);
    setEditOpen(false);
    toast('Job order updated!');
  };

  if (!order) {
    return (
      <AdminLayout>
        <Topbar title="Job Order Detail" />
        <div className="p-6">
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-[#9CA3AF] text-sm">Job order not found.</p>
            <button onClick={() => navigate('/admin/job-orders')}
              className="mt-4 text-xs font-bold uppercase tracking-wider text-[#0E5C3F] hover:underline">
              Back to Job Orders
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const matchingCandidates = candidates.filter(c =>
    c.industry === order.industry &&
    (c.status === 'available' || c.status === 'interviewing')
  );

  return (
    <AdminLayout>
      <Topbar title="Job Order Detail" subtitle={order.id} />
      <div className="p-6 space-y-4">
        <button onClick={() => navigate('/admin/job-orders')}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6B7280] hover:text-[#16201C] transition-colors">
          <ArrowLeft size={14} /> Back to Job Orders
        </button>

        <div className="bg-white rounded-xl border border-[#E4E0D8] p-6">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <h2 className="text-2xl font-black text-[#16201C]">{order.title}</h2>
              <p className="text-sm text-[#6B7280] mt-1">{order.clientName}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <StatusBadge status={order.type} />
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B7280]">
                <span className={`w-2 h-2 rounded-full ${PRIORITY_COLORS[order.priority].dot}`} />
                {PRIORITY_COLORS[order.priority].label}
              </span>
              <StatusBadge status={order.status} />
              <div className="w-px h-5 bg-[#E4E0D8] mx-1" />
              <button onClick={() => setEditOpen(true)}
                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6B7280] hover:text-[#16201C] transition-colors">
                <Edit size={13} /> Edit
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="bg-[#F9F8F5] rounded-lg p-3">
              <p className="text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold mb-1">Location</p>
              <p className="font-bold text-[#16201C]">{order.location || '—'}</p>
            </div>
            <div className="bg-[#F9F8F5] rounded-lg p-3">
              <p className="text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold mb-1">Start Date</p>
              <p className="font-bold text-[#16201C]">{order.startDate ? new Date(order.startDate).toLocaleDateString() : '—'}</p>
            </div>
            <div className="bg-[#F9F8F5] rounded-lg p-3">
              <p className="text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold mb-1">Industry</p>
              <p className="font-bold text-[#16201C]">{order.industry}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-[#E4E0D8] p-5">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#16201C] mb-3">Job Description</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">{order.description || 'No description provided.'}</p>
            </div>

            {order.requirements.length > 0 && (
              <div className="bg-white rounded-xl border border-[#E4E0D8] p-5">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#16201C] mb-3">Requirements</h3>
                <ul className="space-y-2">
                  {order.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#6B7280]">
                      <span className="text-[#0E5C3F] mt-0.5">✓</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-white rounded-xl border border-[#E4E0D8] p-5">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#16201C] mb-3">Compensation</h3>
              <p className="text-2xl font-black text-[#16201C]">{order.payRate || '—'}</p>
            </div>
          </div>

          <div className="space-y-4">
            {order.candidateId ? (
              <div className="bg-white rounded-xl border border-[#E4E0D8] p-5">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#16201C] mb-3">Assigned Candidate</h3>
                <Link to={`/admin/candidates/${order.candidateId}`}
                  className="text-sm font-bold text-[#0E5C3F] hover:underline">
                  {order.candidateName}
                </Link>
                <p className="text-xs text-[#9CA3AF] mt-1">Candidate assigned to this role</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-[#E4E0D8] p-5">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#16201C] mb-3">Assigned Candidate</h3>
                <p className="text-sm text-[#9CA3AF]">No candidate assigned</p>
              </div>
            )}

            {matchingCandidates.length > 0 && (
              <div className="bg-white rounded-xl border border-[#E4E0D8] p-5">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#16201C] mb-3">
                  Matching Candidates ({matchingCandidates.length})
                </h3>
                <div className="space-y-3">
                  {matchingCandidates.map(c => (
                    <div key={c.id} className="border border-[#E4E0D8] rounded-lg p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link to={`/admin/candidates/${c.id}`}
                            className="text-sm font-bold text-[#16201C] hover:text-[#0E5C3F] transition-colors">
                            {c.firstName} {c.lastName}
                          </Link>
                          <p className="text-[10px] text-[#6B7280] mt-0.5">{c.role}</p>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <StatusBadge status={c.status} size="sm" />
                            {c.skills.length > 0 && (
                              <span className="text-[10px] text-[#9CA3AF]">
                                {c.skills.slice(0, 2).join(', ')}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleAssign(c)}
                          className="text-[10px] font-bold uppercase tracking-wider bg-[#0E5C3F] hover:bg-[#073D29] text-white px-3 py-1.5 rounded transition-colors whitespace-nowrap">
                          Assign
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl border border-[#E4E0D8] p-5">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#16201C] mb-3">Status Actions</h3>
              <div className="space-y-2">
                {order.status === 'open' && (
                  <button
                    onClick={() => handleStatusChange('in_progress')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase text-xs tracking-wider py-2.5 rounded-lg transition-colors">
                    Start Progress
                  </button>
                )}
                {order.status === 'in_progress' && (
                  <button
                    onClick={() => handleStatusChange('filled', new Date().toISOString())}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold uppercase text-xs tracking-wider py-2.5 rounded-lg transition-colors">
                    Mark Filled
                  </button>
                )}
                {(order.status === 'open' || order.status === 'in_progress') && (
                  <button
                    onClick={() => handleStatusChange('cancelled')}
                    className="w-full border border-red-500 text-red-500 hover:bg-red-50 font-bold uppercase text-xs tracking-wider py-2.5 rounded-lg transition-colors">
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <SlidePanel open={editOpen} onClose={() => setEditOpen(false)} title="Edit Job Order">
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#6B7280] tracking-wider mb-1.5">Title *</label>
            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full border border-[#E4E0D8] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0E5C3F]" />
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
              className="w-full border border-[#E4E0D8] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0E5C3F]" />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#6B7280] tracking-wider mb-1.5">Pay Rate</label>
            <input type="text" value={form.payRate} onChange={e => setForm({ ...form, payRate: e.target.value })}
              className="w-full border border-[#E4E0D8] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0E5C3F]" />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#6B7280] tracking-wider mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3}
              className="w-full border border-[#E4E0D8] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0E5C3F] resize-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#6B7280] tracking-wider mb-1.5">Requirements <span className="normal-case font-normal">(comma-separated)</span></label>
            <textarea value={form.requirements} onChange={e => setForm({ ...form, requirements: e.target.value })} rows={2}
              className="w-full border border-[#E4E0D8] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0E5C3F] resize-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-[#6B7280] tracking-wider mb-1.5">Notes</label>
            <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2}
              className="w-full border border-[#E4E0D8] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0E5C3F] resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleEditSave}
              className="flex-1 bg-[#0E5C3F] hover:bg-[#073D29] text-white font-black uppercase text-xs tracking-wider py-3 rounded-lg transition-colors">
              Save Changes
            </button>
            <button onClick={() => setEditOpen(false)}
              className="px-6 border border-[#E4E0D8] text-[#6B7280] font-bold uppercase text-xs tracking-wider py-3 rounded-lg hover:bg-[#F9F8F5] transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </SlidePanel>
    </AdminLayout>
  );
}