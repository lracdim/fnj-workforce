import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Mail, Phone, Calendar, Edit2, Save, X, Briefcase, Clock, Wrench, ExternalLink } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import Topbar from '../components/layout/Topbar';
import StatusBadge from '../components/ui/StatusBadge';
import { storage } from '../utils/storage';
import { initializeData, type Candidate, type Placement, type Interview, type JobOrder, type ActivityEntry } from '../data/seed';

const INDUSTRIES = [
  'Healthcare', 'Information Technology', 'Hospitality', 'Manufacturing',
  'Transportation', 'Construction', 'Administrative', 'Education', 'Retail'
];

const EXPERIENCE_LEVELS = ['Entry', '1-2 years', '3-5 years', '5-10 years', '10+ years'];

export default function CandidateProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [jobOrders, setJobOrders] = useState<JobOrder[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Candidate | null>(null);

  useEffect(() => {
    initializeData();
    const candidates = storage.get<Candidate[]>('fnj_candidates') || [];
    const found = candidates.find(c => c.id === id);
    setCandidate(found || null);
    setPlacements(storage.get<Placement[]>('fnj_placements') || []);
    setInterviews(storage.get<Interview[]>('fnj_interviews') || []);
    setJobOrders(storage.get<JobOrder[]>('fnj_job_orders') || []);
  }, [id]);

  if (!candidate) {
    return (
      <AdminLayout>
        <Topbar title="Candidate" />
        <div className="p-6">
          <div className="bg-white rounded-xl border border-[#E4E0D8] p-12 text-center">
            <p className="text-[#6B7280]">Candidate not found</p>
            <button
              onClick={() => navigate('/admin/candidates')}
              className="mt-4 text-sm text-[#0E5C3F] font-bold hover:underline"
            >
              ← Back to Candidates
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const candidatePlacements = placements.filter(p => p.candidateId === candidate.id);
  const candidateInterviews = interviews.filter(i => i.candidateId === candidate.id);
  const activePlacements = candidatePlacements.filter(p => p.status === 'active');
  const totalInterviews = candidateInterviews.length;
  const daysActive = Math.floor((Date.now() - new Date(candidate.addedAt).getTime()) / (1000 * 60 * 60 * 24));
  const skillsCount = candidate.skills.length;

  const matchingJobOrders = jobOrders.filter(jo => 
    jo.industry === candidate.industry && 
    (jo.status === 'open' || jo.status === 'in_progress')
  );

  const handleStatusChange = (newStatus: string) => {
    if (!candidate) return;
    const updated = { ...candidate, status: newStatus as Candidate['status'] };
    setCandidate(updated);
    
    const candidates = storage.get<Candidate[]>('fnj_candidates') || [];
    const idx = candidates.findIndex(c => c.id === candidate.id);
    if (idx !== -1) {
      candidates[idx] = updated;
      storage.set('fnj_candidates', candidates);
    }

    const activity: ActivityEntry[] = storage.get<ActivityEntry[]>('fnj_activity') || [];
    const newActivity: ActivityEntry = {
      id: `ACT-${String(activity.length + 1).padStart(3, '0')}`,
      type: 'status_changed',
      description: `${candidate.firstName} ${candidate.lastName} status → ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
      timestamp: new Date().toISOString(),
      entityId: candidate.id,
      entityType: 'candidate'
    };
    storage.set('fnj_activity', [...activity, newActivity]);
  };

  const startEditing = () => {
    setEditData({ ...candidate });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setEditData(null);
    setIsEditing(false);
  };

  const saveEdit = () => {
    if (!editData || !candidate) return;
    
    setCandidate(editData);
    
    const candidates = storage.get<Candidate[]>('fnj_candidates') || [];
    const idx = candidates.findIndex(c => c.id === candidate.id);
    if (idx !== -1) {
      candidates[idx] = editData;
      storage.set('fnj_candidates', candidates);
    }

    const activity: ActivityEntry[] = storage.get<ActivityEntry[]>('fnj_activity') || [];
    const newActivity: ActivityEntry = {
      id: `ACT-${String(activity.length + 1).padStart(3, '0')}`,
      type: 'candidate_added',
      description: `${editData.firstName} ${editData.lastName} profile updated`,
      timestamp: new Date().toISOString(),
      entityId: candidate.id,
      entityType: 'candidate'
    };
    storage.set('fnj_activity', [...activity, newActivity]);

    setIsEditing(false);
    setEditData(null);
  };

  const handleEditChange = (field: keyof Candidate, value: string | string[]) => {
    if (!editData) return;
    setEditData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const currentData = isEditing && editData ? editData : candidate;

  return (
    <AdminLayout>
      <Topbar 
        title="Candidate" 
        subtitle={candidate.id}
      />
      
      <div className="p-6 space-y-4">
        <button
          onClick={() => navigate('/admin/candidates')}
          className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#16201C] transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Candidates
        </button>

        <div className="bg-white rounded-xl border border-[#E4E0D8] p-6">
          <div className="flex items-start justify-between">
            <div>
              {isEditing && editData ? (
                <div className="flex items-center gap-4 mb-4">
                  <input
                    type="text"
                    value={editData.firstName}
                    onChange={e => handleEditChange('firstName', e.target.value)}
                    className="text-2xl font-black text-[#16201C] px-2 py-1 border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F]"
                  />
                  <input
                    type="text"
                    value={editData.lastName}
                    onChange={e => handleEditChange('lastName', e.target.value)}
                    className="text-2xl font-black text-[#16201C] px-2 py-1 border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F]"
                  />
                </div>
              ) : (
                <h2 className="text-2xl font-black text-[#16201C] mb-2">
                  {candidate.firstName} {candidate.lastName}
                </h2>
              )}
              
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-[#0E5C3F]/10 text-[#0E5C3F] px-2 py-0.5 rounded text-[10px] font-semibold">
                  {currentData.industry}
                </span>
                <span className="text-sm text-[#6B7280]">{currentData.role}</span>
              </div>
              
              <div className="mt-3">
                <StatusBadge status={currentData.status} />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={cancelEditing}
                    className="px-4 py-2 text-xs font-bold text-[#6B7280] border border-[#E4E0D8] rounded-lg hover:bg-[#F9F8F5] transition-colors flex items-center gap-2"
                  >
                    <X size={14} />
                    Cancel
                  </button>
                  <button
                    onClick={saveEdit}
                    className="px-4 py-2 text-xs font-bold bg-[#0E5C3F] text-white rounded-lg hover:bg-[#073D29] transition-colors flex items-center gap-2"
                  >
                    <Save size={14} />
                    Save
                  </button>
                </>
              ) : (
                <button
                  onClick={startEditing}
                  className="px-4 py-2 text-xs font-bold text-[#6B7280] border border-[#E4E0D8] rounded-lg hover:bg-[#F9F8F5] transition-colors flex items-center gap-2"
                >
                  <Edit2 size={14} />
                  Edit Candidate
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 pt-6 border-t border-[#E4E0D8]">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-[#9CA3AF]" />
              {isEditing && editData ? (
                <input
                  type="text"
                  value={editData.location}
                  onChange={e => handleEditChange('location', e.target.value)}
                  className="text-sm text-[#6B7280] px-1 py-0.5 border border-[#E4E0D8] rounded focus:outline-none focus:border-[#0E5C3F]"
                />
              ) : (
                <span className="text-sm text-[#6B7280]">{candidate.location}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-[#9CA3AF]" />
              {isEditing && editData ? (
                <select
                  value={editData.experience}
                  onChange={e => handleEditChange('experience', e.target.value)}
                  className="text-sm text-[#6B7280] px-1 py-0.5 border border-[#E4E0D8] rounded focus:outline-none focus:border-[#0E5C3F] bg-white"
                >
                  {EXPERIENCE_LEVELS.map(exp => (
                    <option key={exp} value={exp}>{exp}</option>
                  ))}
                </select>
              ) : (
                <span className="text-sm text-[#6B7280]">{candidate.experience}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-[#9CA3AF]" />
              {isEditing && editData ? (
                <input
                  type="email"
                  value={editData.email}
                  onChange={e => handleEditChange('email', e.target.value)}
                  className="text-sm text-[#6B7280] px-1 py-0.5 border border-[#E4E0D8] rounded focus:outline-none focus:border-[#0E5C3F]"
                />
              ) : (
                <span className="text-sm text-[#6B7280]">{candidate.email}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-[#9CA3AF]" />
              {isEditing && editData ? (
                <input
                  type="tel"
                  value={editData.phone}
                  onChange={e => handleEditChange('phone', e.target.value)}
                  className="text-sm text-[#6B7280] px-1 py-0.5 border border-[#E4E0D8] rounded focus:outline-none focus:border-[#0E5C3F]"
                />
              ) : (
                <span className="text-sm text-[#6B7280]">{candidate.phone}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-[#9CA3AF]" />
              <span className="text-sm text-[#6B7280]">Added {formatDate(candidate.addedAt)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-[#E4E0D8] p-5">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={14} className="text-[#0E5C3F]" />
              <span className="text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold">Total Interviews</span>
            </div>
            <p className="text-3xl font-black text-[#16201C]">{totalInterviews}</p>
          </div>
          <div className="bg-white rounded-xl border border-[#E4E0D8] p-5">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase size={14} className="text-[#0E5C3F]" />
              <span className="text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold">Active Placements</span>
            </div>
            <p className="text-3xl font-black text-[#16201C]">{activePlacements.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-[#E4E0D8] p-5">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={14} className="text-[#0E5C3F]" />
              <span className="text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold">Days Active</span>
            </div>
            <p className="text-3xl font-black text-[#16201C]">{daysActive}</p>
          </div>
          <div className="bg-white rounded-xl border border-[#E4E0D8] p-5">
            <div className="flex items-center gap-2 mb-2">
              <Wrench size={14} className="text-[#0E5C3F]" />
              <span className="text-[10px] uppercase tracking-wider text-[#9CA3AF] font-bold">Skills Count</span>
            </div>
            <p className="text-3xl font-black text-[#16201C]">{skillsCount}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 space-y-4">
            <div className="bg-white rounded-xl border border-[#E4E0D8] p-5">
              <h3 className="font-black uppercase text-[10px] tracking-wider text-[#9CA3AF] mb-4">Contact Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[#9CA3AF] mb-1">Email</p>
                  {isEditing && editData ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={e => handleEditChange('email', e.target.value)}
                      className="w-full text-sm text-[#16201C] px-2 py-1 border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F]"
                    />
                  ) : (
                    <p className="text-sm text-[#16201C]">{candidate.email}</p>
                  )}
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[#9CA3AF] mb-1">Phone</p>
                  {isEditing && editData ? (
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={e => handleEditChange('phone', e.target.value)}
                      className="w-full text-sm text-[#16201C] px-2 py-1 border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F]"
                    />
                  ) : (
                    <p className="text-sm text-[#16201C]">{candidate.phone}</p>
                  )}
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[#9CA3AF] mb-1">Location</p>
                  {isEditing && editData ? (
                    <input
                      type="text"
                      value={editData.location}
                      onChange={e => handleEditChange('location', e.target.value)}
                      className="w-full text-sm text-[#16201C] px-2 py-1 border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F]"
                    />
                  ) : (
                    <p className="text-sm text-[#16201C]">{candidate.location}</p>
                  )}
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[#9CA3AF] mb-1">Experience</p>
                  {isEditing && editData ? (
                    <select
                      value={editData.experience}
                      onChange={e => handleEditChange('experience', e.target.value)}
                      className="w-full text-sm text-[#16201C] px-2 py-1 border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] bg-white"
                    >
                      {EXPERIENCE_LEVELS.map(exp => (
                        <option key={exp} value={exp}>{exp}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-sm text-[#16201C]">{candidate.experience}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#E4E0D8] p-5">
              <h3 className="font-black uppercase text-[10px] tracking-wider text-[#9CA3AF] mb-4">Skills</h3>
              {isEditing && editData ? (
                <input
                  type="text"
                  value={editData.skills.join(', ')}
                  onChange={e => handleEditChange('skills', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                  className="w-full text-sm text-[#16201C] px-3 py-2 border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F]"
                  placeholder="Comma-separated skills"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill, i) => (
                    <span key={i} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-[#E4E0D8] p-5">
              <h3 className="font-black uppercase text-[10px] tracking-wider text-[#9CA3AF] mb-4">Notes</h3>
              {isEditing && editData ? (
                <textarea
                  value={editData.notes}
                  onChange={e => handleEditChange('notes', e.target.value)}
                  rows={4}
                  className="w-full text-sm text-[#16201C] px-3 py-2 border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] resize-none"
                />
              ) : (
                <p className="text-sm text-[#6B7280] leading-relaxed">{candidate.notes || 'No notes yet.'}</p>
              )}
            </div>

            <div className="bg-white rounded-xl border border-[#E4E0D8] p-5">
              <h3 className="font-black uppercase text-[10px] tracking-wider text-[#9CA3AF] mb-4">Placement History</h3>
              {candidatePlacements.length === 0 ? (
                <p className="text-sm text-[#9CA3AF]">No placements yet.</p>
              ) : (
                <div className="space-y-3">
                  {candidatePlacements.map(p => (
                    <div key={p.id} className="flex items-start justify-between p-3 bg-[#F9F8F5] rounded-lg">
                      <div>
                        <p className="text-sm font-bold text-[#16201C]">{p.role}</p>
                        <p className="text-xs text-[#6B7280]">{p.clientName}</p>
                        <p className="text-[10px] text-[#9CA3AF] mt-1">{formatDate(p.placedAt)}</p>
                      </div>
                      <StatusBadge status={p.status} size="sm" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-[#E4E0D8] p-5">
              <h3 className="font-black uppercase text-[10px] tracking-wider text-[#9CA3AF] mb-4">Interview History</h3>
              {candidateInterviews.length === 0 ? (
                <p className="text-sm text-[#9CA3AF]">No interviews yet.</p>
              ) : (
                <div className="space-y-3">
                  {candidateInterviews.map(interview => (
                    <div key={interview.id} className="p-3 bg-[#F9F8F5] rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-bold text-[#16201C]">{interview.role}</p>
                        <StatusBadge status={interview.type} size="sm" />
                      </div>
                      <p className="text-xs text-[#6B7280]">{interview.clientName}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-[10px] text-[#9CA3AF]">{formatDate(interview.scheduledAt)}</p>
                        <StatusBadge status={interview.outcome} size="sm" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-[#E4E0D8] p-5">
              <h3 className="font-black uppercase text-[10px] tracking-wider text-[#9CA3AF] mb-4">Matching Job Orders</h3>
              {matchingJobOrders.length === 0 ? (
                <p className="text-sm text-[#9CA3AF]">No matching job orders.</p>
              ) : (
                <div className="space-y-3">
                  {matchingJobOrders.map(jo => (
                    <div key={jo.id} className="p-3 bg-[#F9F8F5] rounded-lg">
                      <p className="text-sm font-bold text-[#16201C]">{jo.title}</p>
                      <p className="text-xs text-[#6B7280]">{jo.clientName}</p>
                      <div className="flex items-center justify-between mt-2">
                        <StatusBadge status={jo.status} size="sm" />
                        <button
                          onClick={() => navigate(`/admin/job-orders/${jo.id}`)}
                          className="text-[10px] text-[#0E5C3F] font-bold hover:underline flex items-center gap-1"
                        >
                          View Order <ExternalLink size={10} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E4E0D8] p-5">
          <h3 className="font-black uppercase text-[10px] tracking-wider text-[#9CA3AF] mb-4">Update Status</h3>
          <div className="flex items-center gap-4">
            <select
              value={candidate.status}
              onChange={e => handleStatusChange(e.target.value)}
              className="px-4 py-2 text-sm border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] bg-white"
            >
              <option value="available">Available</option>
              <option value="interviewing">Interviewing</option>
              <option value="placed">Placed</option>
              <option value="inactive">Inactive</option>
            </select>
            <span className="text-xs text-[#9CA3AF]">
              Changing status will be logged in activity history.
            </span>
          </div>
        </div>

        {isEditing && editData && (
          <div className="bg-white rounded-xl border border-[#E4E0D8] p-5">
            <h3 className="font-black uppercase text-[10px] tracking-wider text-[#9CA3AF] mb-4">Edit Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#9CA3AF] mb-1">Industry</label>
                <select
                  value={editData.industry}
                  onChange={e => handleEditChange('industry', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F] bg-white"
                >
                  {INDUSTRIES.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#9CA3AF] mb-1">Role</label>
                <input
                  type="text"
                  value={editData.role}
                  onChange={e => handleEditChange('role', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-[#E4E0D8] rounded-lg focus:outline-none focus:border-[#0E5C3F]"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}