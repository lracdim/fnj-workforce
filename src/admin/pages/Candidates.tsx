import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, ChevronDown } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import Topbar from '../components/layout/Topbar';
import SlidePanel from '../components/ui/SlidePanel';
import StatusBadge from '../components/ui/StatusBadge';
import { storage } from '../utils/storage';
import { initializeData, type Candidate, type ActivityEntry } from '../data/seed';

const INDUSTRIES = [
  'Healthcare', 'Information Technology', 'Hospitality', 'Manufacturing',
  'Transportation', 'Construction', 'Administrative', 'Education', 'Retail'
];

const EXPERIENCE_LEVELS = ['Entry', '1-2 years', '3-5 years', '5-10 years', '10+ years'];

export default function Candidates() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPanel, setShowPanel] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    industry: '', role: '', experience: '', location: '', skills: '', notes: ''
  });
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    initializeData();
    setCandidates(storage.get<Candidate[]>('fnj_candidates') || []);
  }, []);

  const filters = ['All', 'Available', 'Interviewing', 'Placed', 'Inactive'];

  const filteredCandidates = candidates.filter(c => {
    const matchesFilter = activeFilter === 'All' || c.status === activeFilter.toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      c.firstName.toLowerCase().includes(q) ||
      c.lastName.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q) ||
      c.industry.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const handleAddCandidate = () => {
    const existingIds = candidates
      .map(c => parseInt(c.id.replace('CND-', '')))
      .filter(n => !isNaN(n));
    const nextNum = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
    const newId = `CND-${String(nextNum).padStart(3, '0')}`;

    const skillsArray = formData.skills
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const newCandidate: Candidate = {
      id: newId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      industry: formData.industry,
      role: formData.role,
      experience: formData.experience,
      location: formData.location,
      skills: skillsArray,
      notes: formData.notes,
      status: 'available',
      addedAt: new Date().toISOString(),
      resumeUrl: null
    };

    const updated = [...candidates, newCandidate];
    setCandidates(updated);
    storage.set('fnj_candidates', updated);

    const activity: ActivityEntry[] = storage.get<ActivityEntry[]>('fnj_activity') || [];
    const newActivity: ActivityEntry = {
      id: `ACT-${String(activity.length + 1).padStart(3, '0')}`,
      type: 'candidate_added',
      description: `New candidate added: ${newCandidate.firstName} ${newCandidate.lastName} (${newCandidate.role})`,
      timestamp: new Date().toISOString(),
      entityId: newId,
      entityType: 'candidate'
    };
    storage.set('fnj_activity', [...activity, newActivity]);

    setFormData({
      firstName: '', lastName: '', email: '', phone: '',
      industry: '', role: '', experience: '', location: '', skills: '', notes: ''
    });
    setShowPanel(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <AdminLayout>
      <Topbar title="Candidates" subtitle={`${candidates.length} total candidates`} />
      
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {filters.map(f => (
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
                placeholder="Search name, role, industry..."
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
              Add Candidate
            </button>
          </div>
        </div>

        <div className="table-container bg-white rounded-xl border border-[#E4E0D8] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F9F8F5] text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold">
                <th className="text-left px-4 py-3">ID</th>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Industry</th>
                <th className="text-left px-4 py-3">Role</th>
                <th className="text-left px-4 py-3">Skills</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Added</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-[#9CA3AF]">
                    No candidates found
                  </td>
                </tr>
              ) : (
                filteredCandidates.map(c => (
                  <tr
                    key={c.id}
                    className="border-t border-[#E4E0D8] hover:bg-[#F9F8F5] cursor-pointer transition-colors"
                    onClick={() => navigate(`/admin/candidates/${c.id}`)}
                  >
                    <td className="px-4 py-3 text-xs text-[#9CA3AF] font-mono">{c.id}</td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-bold text-[#16201C]">
                        {c.firstName} {c.lastName}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-[#0E5C3F]/10 text-[#0E5C3F] px-2 py-0.5 rounded text-[10px] font-semibold">
                        {c.industry}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#6B7280]">{c.role}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {c.skills.slice(0, 2).map((skill, i) => (
                          <span key={i} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px]">
                            {skill}
                          </span>
                        ))}
                        {c.skills.length > 2 && (
                          <span className="text-[10px] text-[#9CA3AF] cursor-help" title={c.skills.slice(2).join(', ')}>
                            +{c.skills.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={c.status} size="sm" />
                    </td>
                    <td className="px-4 py-3 text-xs text-[#9CA3AF] truncate max-w-[100px]">
                      {formatDate(c.addedAt)}
                    </td>
                    <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === c.id ? null : c.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <ChevronDown size={14} className="text-[#6B7280]" />
                        </button>
                        {openMenuId === c.id && (
                          <div className="absolute right-0 top-8 w-32 bg-white border border-[#E4E0D8] rounded-lg shadow-lg z-20 py-1">
                            <button
                              onClick={() => navigate(`/admin/candidates/${c.id}`)}
                              className="w-full px-3 py-2 text-xs text-left text-[#16201C] hover:bg-[#F9F8F5]"
                            >
                              View Profile
                            </button>
                            <button
                              onClick={() => navigate(`/admin/candidates/${c.id}/edit`)}
                              className="w-full px-3 py-2 text-xs text-left text-[#16201C] hover:bg-[#F9F8F5]"
                            >
                              Edit
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

      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Add Candidate">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#6B7280] mb-1.5">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={e => handleInputChange('firstName', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#6B7280] mb-1.5">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={e => handleInputChange('lastName', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#6B7280] mb-1.5">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#6B7280] mb-1.5">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={e => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#6B7280] mb-1.5">Industry</label>
            <select
              value={formData.industry}
              onChange={e => handleInputChange('industry', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] bg-white"
            >
              <option value="">Select industry...</option>
              {INDUSTRIES.map(ind => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[#6B7280] mb-1.5">Role</label>
              <input
                type="text"
                value={formData.role}
                onChange={e => handleInputChange('role', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-[#6B7280] mb-1.5">Experience</label>
              <select
                value={formData.experience}
                onChange={e => handleInputChange('experience', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] bg-white"
              >
                <option value="">Select experience...</option>
                {EXPERIENCE_LEVELS.map(exp => (
                  <option key={exp} value={exp}>{exp}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#6B7280] mb-1.5">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={e => handleInputChange('location', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F]"
              placeholder="e.g. Sacramento, CA"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#6B7280] mb-1.5">Skills</label>
            <input
              type="text"
              value={formData.skills}
              onChange={e => handleInputChange('skills', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F]"
              placeholder="Comma-separated (e.g. Patient Care, EMR Systems, HIPAA)"
            />
            <p className="text-[10px] text-[#9CA3AF] mt-1">Separate skills with commas</p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-[#6B7280] mb-1.5">Notes</label>
            <textarea
              value={formData.notes}
              onChange={e => handleInputChange('notes', e.target.value)}
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
              onClick={handleAddCandidate}
              disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.industry || !formData.role}
              className="flex-1 px-4 py-2.5 text-sm font-bold bg-[#0E5C3F] text-white rounded-lg hover:bg-[#073D29] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Candidate
            </button>
          </div>
        </div>
      </SlidePanel>

      {showToast && (
        <div className="fixed bottom-6 right-6 bg-[#0E5C3F] text-white px-5 py-3 rounded-lg shadow-lg z-50 animate-slide-up">
          <p className="text-sm font-bold">Candidate added successfully</p>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>
    </AdminLayout>
  );
}