import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Mail, Phone, MapPin, Save } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import Topbar from '../components/layout/Topbar';
import StatusBadge from '../components/ui/StatusBadge';
import StatCard from '../components/ui/StatCard';
import SlidePanel from '../components/ui/SlidePanel';
import { storage } from '../utils/storage';
import { initializeData, type ClientCompany, type JobOrder, type Placement } from '../data/seed';
import { Briefcase, UserCheck, TrendingUp, DollarSign } from 'lucide-react';

const INDUSTRIES = [
  'Healthcare', 'Information Technology', 'Hospitality', 'Manufacturing',
  'Transportation', 'Construction', 'Administrative', 'Education', 'Retail',
];

export default function ClientCompanyProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [company, setCompany] = useState<ClientCompany | null>(null);
  const [jobOrders, setJobOrders] = useState<JobOrder[]>([]);
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [tab, setTab] = useState<'orders' | 'placements' | 'notes'>('orders');
  const [notes, setNotes] = useState('');
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState<ClientCompany | null>(null);

  useEffect(() => {
    initializeData();
    const companies = storage.get<ClientCompany[]>('fnj_companies') || [];
    const found = companies.find(c => c.id === id);
    setCompany(found || null);
    if (found) {
      setNotes(found.notes);
      setEditForm(found);
    }
    setJobOrders(storage.get<JobOrder[]>('fnj_job_orders') || []);
    setPlacements(storage.get<Placement[]>('fnj_placements') || []);
  }, [id]);

  if (!company) {
    return (
      <AdminLayout>
        <Topbar title="Company Profile" />
        <div className="p-6 text-center text-[#9CA3AF]">Company not found.</div>
      </AdminLayout>
    );
  }

  const companyJobOrders = jobOrders.filter(j => j.clientId === id);
  const companyPlacements = placements.filter(p => p.clientId === id);
  const totalPlacements = companyPlacements.length;
  const openOrders = companyJobOrders.filter(j => j.status === 'open' || j.status === 'in_progress').length;
  const activeStaff = companyPlacements.filter(p => p.status === 'active').length;
  const totalBilled = totalPlacements * 500;

  const handleSaveNotes = () => {
    const companies = storage.get<ClientCompany[]>('fnj_companies') || [];
    const updated = companies.map(c => c.id === id ? { ...c, notes } : c);
    storage.set('fnj_companies', updated);
    setCompany({ ...company, notes });
    alert('Notes saved successfully');
  };

  const handleSaveEdit = () => {
    if (!editForm) return;
    const companies = storage.get<ClientCompany[]>('fnj_companies') || [];
    const updated = companies.map(c => c.id === id ? editForm : c);
    storage.set('fnj_companies', updated);
    setCompany(editForm);
    setShowEdit(false);
    alert('Company updated successfully');
  };

  return (
    <AdminLayout>
      <Topbar title="Company Profile" subtitle={company.id} />
      <div className="p-6 space-y-4">
        <button
          onClick={() => navigate('/admin/companies')}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6B7280] hover:text-[#16201C] transition-colors"
        >
          <ArrowLeft size={14} /> Back to Companies
        </button>

        <div className="relative bg-white rounded-xl border border-[#E4E0D8] p-6">
          <button
            onClick={() => setShowEdit(true)}
            className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 bg-[#0E5C3F] hover:bg-[#073D29] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
          >
            <Edit size={12} /> Edit Company
          </button>
          <div className="pr-32">
            <h2 className="text-2xl font-black text-[#16201C]">{company.name}</h2>
            <div className="flex items-center gap-3 mt-3">
              <span className="inline-block px-3 py-1 text-xs font-medium bg-[#F9F8F5] text-[#6B7280] rounded-full border border-[#E4E0D8]">
                {company.industry}
              </span>
              <StatusBadge status={company.status} size="sm" />
            </div>
            <div className="flex flex-wrap items-center gap-6 mt-4 text-sm text-[#6B7280]">
              <div className="flex items-center gap-2">
                <span className="font-medium text-[#16201C]">{company.contactName}</span>
              </div>
              <a href={`mailto:${company.contactEmail}`} className="flex items-center gap-1.5 text-[#0E5C3F] hover:underline">
                <Mail size={13} /> {company.contactEmail}
              </a>
              <a href={`tel:${company.contactPhone}`} className="flex items-center gap-1.5 text-[#0E5C3F] hover:underline">
                <Phone size={13} /> {company.contactPhone}
              </a>
              <div className="flex items-center gap-1.5">
                <MapPin size={13} /> {company.address}, {company.city}, {company.state}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Placements" value={totalPlacements} icon={Briefcase} trend="all time" trendUp={true} />
          <StatCard title="Open Job Orders" value={openOrders} icon={TrendingUp} />
          <StatCard title="Active Staff" value={activeStaff} icon={UserCheck} trend="currently placed" trendUp={true} />
          <StatCard title="Total Billed" value={`$${totalBilled.toLocaleString()}`} icon={DollarSign} />
        </div>

        <div className="bg-white rounded-xl border border-[#E4E0D8] overflow-hidden">
          <div className="flex border-b border-[#E4E0D8]">
            {(['orders', 'placements', 'notes'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-6 py-4 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
                  tab === t ? 'border-[#0E5C3F] text-[#16201C]' : 'border-transparent text-[#6B7280] hover:text-[#16201C]'
                }`}
              >
                {t === 'orders' ? 'Job Orders' : t === 'placements' ? 'Placements' : 'Notes'}
              </button>
            ))}
          </div>
          <div className="p-6">
            {tab === 'orders' && (
              <div className="space-y-3">
                {companyJobOrders.length === 0 ? (
                  <p className="text-sm text-[#9CA3AF] text-center py-8">No job orders for this company.</p>
                ) : (
                  companyJobOrders.map(order => (
                    <div
                      key={order.id}
                      onClick={() => navigate(`/admin/job-orders/${order.id}`)}
                      className="flex items-center justify-between p-4 border border-[#E4E0D8] rounded-lg hover:bg-[#F9F8F5] cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${order.priority === 'urgent' ? 'bg-red-500' : order.priority === 'standard' ? 'bg-[#0E5C3F]' : 'bg-gray-300'}`} />
                        <div>
                          <p className="text-sm font-bold text-[#16201C]">{order.title}</p>
                          <p className="text-xs text-[#9CA3AF]">{order.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <StatusBadge status={order.type} size="sm" />
                        <StatusBadge status={order.status} size="sm" />
                        <span className="text-xs font-medium text-[#6B7280]">{order.payRate}</span>
                        <span className="text-[11px] text-[#9CA3AF]">{new Date(order.startDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {tab === 'placements' && (
              <div className="space-y-3">
                {companyPlacements.length === 0 ? (
                  <p className="text-sm text-[#9CA3AF] text-center py-8">No placements for this company.</p>
                ) : (
                  companyPlacements.map(placement => (
                    <div
                      key={placement.id}
                      className="flex items-center justify-between p-4 border border-[#E4E0D8] rounded-lg hover:bg-[#F9F8F5] cursor-pointer transition-colors"
                    >
                      <div>
                        <p
                          onClick={() => navigate(`/admin/candidates/${placement.candidateId}`)}
                          className="text-sm font-bold text-[#16201C] hover:text-[#0E5C3F] transition-colors"
                        >
                          {placement.candidateName}
                        </p>
                        <p className="text-xs text-[#9CA3AF]">{placement.role}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <StatusBadge status={placement.type} size="sm" />
                        <StatusBadge status={placement.status} size="sm" />
                        <span className="text-[11px] text-[#9CA3AF]">
                          {new Date(placement.startDate).toLocaleDateString()}
                          {placement.endDate && ` — ${new Date(placement.endDate).toLocaleDateString()}`}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {tab === 'notes' && (
              <div className="space-y-4">
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 text-sm border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors resize-none"
                  placeholder="Add notes about this company..."
                />
                <button
                  onClick={handleSaveNotes}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#0E5C3F] hover:bg-[#073D29] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
                >
                  <Save size={13} /> Save Notes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <SlidePanel open={showEdit} onClose={() => setShowEdit(false)} title="Edit Company">
        {editForm && (
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#9CA3AF] font-semibold mb-1.5">Company Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#9CA3AF] font-semibold mb-1.5">Industry</label>
              <select
                value={editForm.industry}
                onChange={e => setEditForm({ ...editForm, industry: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors bg-white"
              >
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#9CA3AF] font-semibold mb-1.5">Contact Name</label>
                <input
                  type="text"
                  value={editForm.contactName}
                  onChange={e => setEditForm({ ...editForm, contactName: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#9CA3AF] font-semibold mb-1.5">Contact Email</label>
                <input
                  type="email"
                  value={editForm.contactEmail}
                  onChange={e => setEditForm({ ...editForm, contactEmail: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#9CA3AF] font-semibold mb-1.5">Contact Phone</label>
              <input
                type="tel"
                value={editForm.contactPhone}
                onChange={e => setEditForm({ ...editForm, contactPhone: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#9CA3AF] font-semibold mb-1.5">Address</label>
              <input
                type="text"
                value={editForm.address}
                onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#9CA3AF] font-semibold mb-1.5">City</label>
                <input
                  type="text"
                  value={editForm.city}
                  onChange={e => setEditForm({ ...editForm, city: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#9CA3AF] font-semibold mb-1.5">State</label>
                <input
                  type="text"
                  value={editForm.state}
                  onChange={e => setEditForm({ ...editForm, state: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#9CA3AF] font-semibold mb-1.5">Notes</label>
              <textarea
                value={editForm.notes}
                onChange={e => setEditForm({ ...editForm, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2.5 text-sm border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors resize-none"
              />
            </div>
            <button
              onClick={handleSaveEdit}
              className="w-full py-3 bg-[#0E5C3F] hover:bg-[#073D29] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors mt-2"
            >
              Save Changes
            </button>
          </div>
        )}
      </SlidePanel>
    </AdminLayout>
  );
}