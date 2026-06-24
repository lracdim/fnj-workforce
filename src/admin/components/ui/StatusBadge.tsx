interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const config: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  available:    { label: 'Available',    bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500' },
  interviewing: { label: 'Interviewing', bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500' },
  placed:       { label: 'Placed',       bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-500' },
  inactive:     { label: 'Inactive',     bg: 'bg-gray-100',  text: 'text-gray-600',   dot: 'bg-gray-400' },
  active:       { label: 'Active',       bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500' },
  prospect:     { label: 'Prospect',     bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-400' },
  open:         { label: 'Open',         bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500' },
  in_progress:  { label: 'In Progress',  bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-500' },
  filled:       { label: 'Filled',       bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-500' },
  cancelled:    { label: 'Cancelled',    bg: 'bg-red-50',    text: 'text-red-600',    dot: 'bg-red-500' },
  completed:    { label: 'Completed',   bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500' },
  terminated:   { label: 'Terminated',   bg: 'bg-red-50',    text: 'text-red-600',    dot: 'bg-red-500' },
  converted:    { label: 'Converted',    bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-500' },
  scheduled:    { label: 'Scheduled',    bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-500' },
  no_show:      { label: 'No Show',      bg: 'bg-red-50',    text: 'text-red-600',    dot: 'bg-red-500' },
  published:    { label: 'Published',    bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500' },
  draft:        { label: 'Draft',        bg: 'bg-gray-100',  text: 'text-gray-600',   dot: 'bg-gray-400' },
  temporary:    { label: 'Temporary',   bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-500' },
  direct_hire:  { label: 'Direct Hire', bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500' },
  temp_to_hire: { label: 'Temp-to-Hire',bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500' },
  contract:     { label: 'Contract',    bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-500' },
  phone:        { label: 'Phone',        bg: 'bg-gray-100',  text: 'text-gray-600',   dot: 'bg-gray-400' },
  video:        { label: 'Video',        bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-500' },
  in_person:    { label: 'In Person',   bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500' },
  pending:      { label: 'Pending',      bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-500' },
  passed:       { label: 'Passed',      bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500' },
  failed:       { label: 'Failed',       bg: 'bg-red-50',    text: 'text-red-600',    dot: 'bg-red-500' },
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const c = config[status] || config.inactive;
  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full ${c.bg} ${c.text} ${size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}