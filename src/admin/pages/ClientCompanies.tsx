import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import Topbar from '../components/layout/Topbar';
import StatusBadge from '../components/ui/StatusBadge';
import SlidePanel from '../components/ui/SlidePanel';
import { storage } from '../utils/storage';
import { initializeData, type ClientCompany } from '../data/seed';

const INDUSTRIES = [
  'Healthcare', 'Information Technology', 'Hospitality', 'Manufacturing',
  'Transportation', 'Construction', 'Administrative', 'Education', 'Retail',
];

export default function ClientCompanies() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<ClientCompany[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'prospect' | 'inactive'>('all');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const [form, setForm] = useState({
    name: '', industry: 'Healthcare', contactName: '', contactEmail: '',
    contactPhone: '', address: '', city: '', state: 'CA', notes: '',
  });

  useEffect(() => {
    initializeData();
    setCompanies(storage.get<ClientCompany[]>('fnj_companies') || []);
  }, []);

  const filtered = companies.filter(c => {
    const matchFilter = filter === 'all' || c.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.contactName.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const generateId = () => {
    const existing = storage.get<ClientCompany[]>('fnj_companies') || [];
    const num = existing.length + 1;
    return `CLT-${String(num).padStart(3, '0')}`;
  };

  const handleSave = () => {
    const newCompany: ClientCompany = {
      id: generateId(),
      ...form,
      status: 'prospect',
      since: new Date().toISOString().split('T')[0],
      totalPlacements: 0,
      openOrders: 0,
    };
    const existing = storage.get<ClientCompany[]>('fnj_companies') || [];
    storage.set('fnj_companies', [...existing, newCompany]);
    setCompanies([...existing, newCompany]);
    setShowAdd(false);
    setForm({ name: '', industry: 'Healthcare', contactName: '', contactEmail: '', contactPhone: '', address: '', city: '', state: 'CA', notes: '' });
    alert('Company added successfully');
  };

  return (
    <AdminLayout>
      <Topbar title="Client Companies" />
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1 bg-white border border-[#E4E0D8] rounded-lg p-1">
            {(['all', 'active', 'prospect', 'inactive'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${
                  filter === f ? 'bg-[#0E5C3F] text-white' : 'text-[#6B7280] hover:bg-[#F9F8F5]'
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
                placeholder="Search companies..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm bg-white border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors w-64"
              />
            </div>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#0E5C3F] hover:bg-[#073D29] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
            >
              <Plus size={14} /> Add Company
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E4E0D8] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F9F8F5]">
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-[#9CA3AF] font-semibold">Name</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-[#9CA3AF] font-semibold">Industry</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-[#9CA3AF] font-semibold">Contact</th>
                <th className="text-center px-4 py-3 text-[10px] uppercase tracking-wider text-[#9CA3AF] font-semibold">Placements</th>
                <th className="text-center px-4 py-3 text-[10px] uppercase tracking-wider text-[#9CA3AF] font-semibold">Open Orders</th>
                <th className="text-left px-4 py-3 text-[10px] uppercase tracking-wider text-[#9CA3AF] font-semibold">Status</th>
                <th className="text-center px-4 py-3 text-[10px] uppercase tracking-wider text-[#9CA3AF] font-semibold">Since</th>
                <th className="text-center px-4 py-3 text-[10px] uppercase tracking-wider text-[#9CA3AF] font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-[#9CA3AF] text-sm">No companies found.</td></tr>
              ) : (
                filtered.map(c => (
                  <tr
                    key={c.id}
                    onClick={() => navigate(`/admin/companies/${c.id}`)}
                    className="hover:bg-[#F9F8F5] border-t border-[#E4E0D8] cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-4">
                      <span className="text-sm font-bold text-[#16201C]">{c.name}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-block px-2.5 py-1 text-[10px] font-medium bg-[#F9F8F5] text-[#6B7280] rounded-full border border-[#E4E0D8]">
                        {c.industry}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-sm font-medium text-[#16201C]">{c.contactName}</p>
                        <p className="text-[11px] text-[#9CA3AF]">{c.contactEmail}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="text-sm font-bold text-[#16201C]">{c.totalPlacements}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="text-sm font-bold text-[#16201C]">{c.openOrders}</span>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={c.status} size="sm" />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="text-xs text-[#6B7280]">{new Date(c.since).getFullYear()}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={e => { e.stopPropagation(); navigate(`/admin/companies/${c.id}`); }}
                        className="text-[10px] font-bold text-[#0E5C3F] uppercase tracking-wider hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <SlidePanel open={showAdd} onClose={() => setShowAdd(false)} title="Add Company">
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#9CA3AF] font-semibold mb-1.5">Company Name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2.5 text-sm border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#9CA3AF] font-semibold mb-1.5">Industry</label>
            <select
              value={form.industry}
              onChange={e => setForm({ ...form, industry: e.target.value })}
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
                value={form.contactName}
                onChange={e => setForm({ ...form, contactName: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#9CA3AF] font-semibold mb-1.5">Contact Email</label>
              <input
                type="email"
                value={form.contactEmail}
                onChange={e => setForm({ ...form, contactEmail: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#9CA3AF] font-semibold mb-1.5">Contact Phone</label>
            <input
              type="tel"
              value={form.contactPhone}
              onChange={e => setForm({ ...form, contactPhone: e.target.value })}
              className="w-full px-3 py-2.5 text-sm border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#9CA3AF] font-semibold mb-1.5">Address</label>
            <input
              type="text"
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              className="w-full px-3 py-2.5 text-sm border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#9CA3AF] font-semibold mb-1.5">City</label>
              <input
                type="text"
                value={form.city}
                onChange={e => setForm({ ...form, city: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-[#9CA3AF] font-semibold mb-1.5">State</label>
              <input
                type="text"
                value={form.state}
                onChange={e => setForm({ ...form, state: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#9CA3AF] font-semibold mb-1.5">Notes</label>
            <textarea
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2.5 text-sm border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] transition-colors resize-none"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={!form.name || !form.contactName}
            className="w-full py-3 bg-[#0E5C3F] hover:bg-[#073D29] disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors mt-2"
          >
            Save Company
          </button>
        </div>
      </SlidePanel>
    </AdminLayout>
  );
}