import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import Topbar from '../components/layout/Topbar';
import StatusBadge from '../components/ui/StatusBadge';
import { storage } from '../utils/storage';
import { initializeData, type Candidate, type JobOrder, type ActivityEntry } from '../data/seed';

export default function Pipeline() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobOrders, setJobOrders] = useState<JobOrder[]>([]);

  useEffect(() => {
    initializeData();
    setCandidates(storage.get<Candidate[]>('fnj_candidates') || []);
    setJobOrders(storage.get<JobOrder[]>('fnj_job_orders') || []);
  }, []);

  const newCandidates = candidates.filter(c => c.status === 'available');
  const interviewing = candidates.filter(c => c.status === 'interviewing');
  const offerMatching = jobOrders.filter(j => j.status === 'in_progress' && j.candidateId && j.candidateName);
  const placed = candidates.filter(c => c.status === 'placed');

  const addActivity = (entry: ActivityEntry) => {
    const activity: ActivityEntry[] = storage.get<ActivityEntry[]>('fnj_activity') || [];
    storage.set('fnj_activity', [...activity, entry]);
  };

  const moveToInterviewing = (candidate: Candidate) => {
    const updated = candidates.map(c =>
      c.id === candidate.id ? { ...c, status: 'interviewing' as const } : c
    );
    setCandidates(updated);
    storage.set('fnj_candidates', updated);

    const count = (storage.get<ActivityEntry[]>('fnj_activity') || []).length;
    addActivity({
      id: `ACT-${String(count + 1).padStart(3, '0')}`,
      type: 'status_changed',
      description: `${candidate.firstName} ${candidate.lastName} → Interviewing`,
      timestamp: new Date().toISOString(),
      entityId: candidate.id,
      entityType: 'candidate',
    });
  };

  const moveToPlaced = (candidate: Candidate) => {
    const updated = candidates.map(c =>
      c.id === candidate.id ? { ...c, status: 'placed' as const } : c
    );
    setCandidates(updated);
    storage.set('fnj_candidates', updated);

    const count = (storage.get<ActivityEntry[]>('fnj_activity') || []).length;
    addActivity({
      id: `ACT-${String(count + 1).padStart(3, '0')}`,
      type: 'status_changed',
      description: `${candidate.firstName} ${candidate.lastName} → Placed`,
      timestamp: new Date().toISOString(),
      entityId: candidate.id,
      entityType: 'candidate',
    });
  };

  const CandidateCard = ({ candidate, showMoveButton, buttonLabel, onMove }: {
    candidate: Candidate;
    showMoveButton: boolean;
    buttonLabel: string;
    onMove: () => void;
  }) => (
    <div className="bg-white border border-[#E4E0D8] rounded-xl p-4 mb-3">
      <p className="text-sm font-bold text-[#16201C] mb-1">{candidate.firstName} {candidate.lastName}</p>
      <p className="text-xs text-[#6B7280] mb-2">{candidate.role}</p>
      <span className="inline-block bg-[#0E5C3F]/10 text-[#0E5C3F] px-2 py-0.5 rounded text-[10px] font-semibold mb-2">
        {candidate.industry}
      </span>
      <div className="flex items-center gap-1 mb-3 flex-wrap">
        {candidate.skills.slice(0, 2).map((skill, i) => (
          <span key={i} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px]">
            {skill}
          </span>
        ))}
        {candidate.skills.length > 2 && (
          <span
            className="text-[10px] text-[#9CA3AF] cursor-help"
            title={candidate.skills.slice(2).join(', ')}
          >
            +{candidate.skills.length - 2} more
          </span>
        )}
      </div>
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(`/admin/candidates/${candidate.id}`)}
          className="text-[#0E5C3F] font-bold text-xs hover:underline"
        >
          View Profile →
        </button>
        {showMoveButton && (
          <button
            onClick={onMove}
            className="text-xs font-bold text-[#0E5C3F] bg-[#0E5C3F]/10 px-3 py-1.5 rounded-lg hover:bg-[#0E5C3F]/20 transition-colors"
          >
            {buttonLabel}
          </button>
        )}
      </div>
    </div>
  );

  const JobOrderCard = ({ jobOrder }: { jobOrder: JobOrder }) => (
    <div className="bg-white border border-[#E4E0D8] rounded-xl p-4 mb-3">
      <p className="text-sm font-bold text-[#16201C] mb-1">{jobOrder.title}</p>
      <p className="text-xs text-[#6B7280] mb-2">{jobOrder.clientName}</p>
      {jobOrder.candidateName && (
        <button
          onClick={() => {
            const cand = candidates.find(c => c.id === jobOrder.candidateId);
            if (cand) navigate(`/admin/candidates/${cand.id}`);
          }}
          className="text-xs font-bold text-[#0E5C3F] hover:underline mb-2"
        >
          {jobOrder.candidateName}
        </button>
      )}
      <div className="mb-2">
        <StatusBadge status={jobOrder.status} size="sm" />
      </div>
      <button
        onClick={() => navigate(`/admin/job-orders/${jobOrder.id}`)}
        className="text-[#0E5C3F] font-bold text-xs hover:underline"
      >
        View Job Order →
      </button>
    </div>
  );

  return (
    <AdminLayout>
      <Topbar title="Pipeline" subtitle="Hiring pipeline overview" />

      <div className="p-6">
        <div className="grid grid-cols-4 gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-3 px-1">
              <h3 className="text-xs font-black uppercase text-[#16201C] tracking-wide">New Candidates</h3>
              <span className="bg-[#16201C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {newCandidates.length}
              </span>
            </div>
            <div className="flex-1 bg-[#F9F8F5] rounded-xl p-3 overflow-y-auto min-h-32">
              {newCandidates.length === 0 ? (
                <p className="text-xs text-[#9CA3AF] text-center py-4">No candidates</p>
              ) : (
                newCandidates.map(c => (
                  <CandidateCard
                    key={c.id}
                    candidate={c}
                    showMoveButton={true}
                    buttonLabel="Schedule Interview"
                    onMove={() => moveToInterviewing(c)}
                  />
                ))
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-3 px-1">
              <h3 className="text-xs font-black uppercase text-[#16201C] tracking-wide">Interviewing</h3>
              <span className="bg-[#16201C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {interviewing.length}
              </span>
            </div>
            <div className="flex-1 bg-[#F9F8F5] rounded-xl p-3 overflow-y-auto min-h-32">
              {interviewing.length === 0 ? (
                <p className="text-xs text-[#9CA3AF] text-center py-4">No candidates</p>
              ) : (
                interviewing.map(c => (
                  <CandidateCard
                    key={c.id}
                    candidate={c}
                    showMoveButton={true}
                    buttonLabel="Mark as Placed"
                    onMove={() => moveToPlaced(c)}
                  />
                ))
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-3 px-1">
              <h3 className="text-xs font-black uppercase text-[#16201C] tracking-wide">Offer / Matching</h3>
              <span className="bg-[#16201C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {offerMatching.length}
              </span>
            </div>
            <div className="flex-1 bg-[#F9F8F5] rounded-xl p-3 overflow-y-auto min-h-32">
              {offerMatching.length === 0 ? (
                <p className="text-xs text-[#9CA3AF] text-center py-4">No job orders</p>
              ) : (
                offerMatching.map(j => (
                  <JobOrderCard key={j.id} jobOrder={j} />
                ))
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-3 px-1">
              <h3 className="text-xs font-black uppercase text-[#16201C] tracking-wide">Placed</h3>
              <span className="bg-[#16201C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {placed.length}
              </span>
            </div>
            <div className="flex-1 bg-[#F9F8F5] rounded-xl p-3 overflow-y-auto min-h-32">
              {placed.length === 0 ? (
                <p className="text-xs text-[#9CA3AF] text-center py-4">No candidates</p>
              ) : (
                placed.map(c => (
                  <CandidateCard
                    key={c.id}
                    candidate={c}
                    showMoveButton={false}
                    buttonLabel=""
                    onMove={() => {}}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}