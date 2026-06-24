export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  industry: string;
  role: string;
  status: 'available' | 'interviewing' | 'placed' | 'inactive';
  skills: string[];
  experience: string;
  location: string;
  notes: string;
  addedAt: string;
  resumeUrl: string | null;
}

export interface ClientCompany {
  id: string;
  name: string;
  industry: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  city: string;
  state: string;
  status: 'active' | 'inactive' | 'prospect';
  since: string;
  totalPlacements: number;
  notes: string;
  openOrders: number;
}

export interface JobOrder {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  industry: string;
  type: 'temporary' | 'temp_to_hire' | 'direct_hire' | 'contract';
  status: 'open' | 'in_progress' | 'filled' | 'cancelled';
  priority: 'urgent' | 'standard' | 'low';
  location: string;
  payRate: string;
  startDate: string;
  description: string;
  requirements: string[];
  openedAt: string;
  filledAt: string | null;
  candidateId: string | null;
  candidateName: string | null;
  notes: string;
}

export interface Placement {
  id: string;
  candidateId: string;
  candidateName: string;
  clientId: string;
  clientName: string;
  jobOrderId: string;
  role: string;
  industry: string;
  type: 'temporary' | 'temp_to_hire' | 'direct_hire' | 'contract';
  status: 'active' | 'completed' | 'terminated' | 'converted';
  startDate: string;
  endDate: string | null;
  payRate: string;
  notes: string;
  placedAt: string;
}

export interface Interview {
  id: string;
  candidateId: string;
  candidateName: string;
  clientId: string;
  clientName: string;
  jobOrderId: string;
  role: string;
  scheduledAt: string;
  type: 'phone' | 'video' | 'in_person';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  notes: string;
  outcome: 'pending' | 'passed' | 'failed';
}

export interface ActivityEntry {
  id: string;
  type: 'candidate_added' | 'placement_created' | 'job_order_opened' | 'interview_scheduled' | 'status_changed' | 'company_added' | 'blog_published';
  description: string;
  timestamp: string;
  entityId: string;
  entityType: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  status: 'published' | 'draft';
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  readTime: string;
  image: string;
}

export const SEED_CANDIDATES: Candidate[] = [
  {
    id: 'CND-001', firstName: 'Maria', lastName: 'Santos',
    email: 'msantos@email.com', phone: '(916) 555-0101',
    industry: 'Healthcare', role: 'Registered Nurse',
    status: 'available', skills: ['Patient Care', 'IV Therapy', 'EMR Systems', 'HIPAA'],
    experience: '5 years', location: 'Sacramento, CA',
    notes: 'Excellent references. Available for nights.',
    addedAt: new Date(Date.now() - 86400000 * 3).toISOString(), resumeUrl: null,
  },
  {
    id: 'CND-002', firstName: 'James', lastName: 'Holloway',
    email: 'jholloway@email.com', phone: '(916) 555-0102',
    industry: 'Information Technology', role: 'Software Developer',
    status: 'interviewing', skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    experience: '4 years', location: 'Fairfield, CA',
    notes: 'Currently in interview process with TechCorp.',
    addedAt: new Date(Date.now() - 86400000 * 7).toISOString(), resumeUrl: null,
  },
  {
    id: 'CND-003', firstName: 'Diana', lastName: 'Cruz',
    email: 'dcruz@email.com', phone: '(916) 555-0103',
    industry: 'Hospitality', role: 'Hotel Front Desk Manager',
    status: 'placed', skills: ['Guest Relations', 'Reservations', 'Team Management', 'PMS Systems'],
    experience: '7 years', location: 'Vallejo, CA',
    notes: 'Placed at Grand Vista Hotel. Strong performer.',
    addedAt: new Date(Date.now() - 86400000 * 14).toISOString(), resumeUrl: null,
  },
  {
    id: 'CND-004', firstName: 'Kevin', lastName: 'Park',
    email: 'kpark@email.com', phone: '(916) 555-0104',
    industry: 'Manufacturing', role: 'Machine Operator',
    status: 'available', skills: ['CNC Operation', 'Quality Control', 'OSHA Certified', 'Blueprint Reading'],
    experience: '3 years', location: 'Stockton, CA',
    notes: 'OSHA certified. Available immediately.',
    addedAt: new Date(Date.now() - 86400000 * 2).toISOString(), resumeUrl: null,
  },
  {
    id: 'CND-005', firstName: 'Rachel', lastName: 'Kim',
    email: 'rkim@email.com', phone: '(916) 555-0105',
    industry: 'Administrative', role: 'Executive Assistant',
    status: 'available', skills: ['Calendar Management', 'Microsoft Office', 'Travel Coordination', 'Project Management'],
    experience: '6 years', location: 'Concord, CA',
    notes: 'Outstanding organizational skills.',
    addedAt: new Date(Date.now() - 86400000 * 5).toISOString(), resumeUrl: null,
  },
  {
    id: 'CND-006', firstName: 'Marcus', lastName: 'Williams',
    email: 'mwilliams@email.com', phone: '(916) 555-0106',
    industry: 'Transportation', role: 'CDL Driver',
    status: 'placed', skills: ['CDL Class A', 'Route Planning', 'HazMat Certified', 'Log Books'],
    experience: '8 years', location: 'Antioch, CA',
    notes: 'Clean driving record. HazMat certified.',
    addedAt: new Date(Date.now() - 86400000 * 21).toISOString(), resumeUrl: null,
  },
  {
    id: 'CND-007', firstName: 'Sofia', lastName: 'Mendez',
    email: 'smendez@email.com', phone: '(916) 555-0107',
    industry: 'Healthcare', role: 'CNA',
    status: 'interviewing', skills: ['Patient Care', 'Vital Signs', 'Medication Assistance', 'CPR Certified'],
    experience: '2 years', location: 'Rio Vista, CA',
    notes: 'Local candidate. Strong interpersonal skills.',
    addedAt: new Date(Date.now() - 86400000 * 4).toISOString(), resumeUrl: null,
  },
  {
    id: 'CND-008', firstName: 'Tom', lastName: 'Bradley',
    email: 'tbradley@email.com', phone: '(916) 555-0108',
    industry: 'Construction', role: 'Site Supervisor',
    status: 'inactive', skills: ['Project Management', 'OSHA 30', 'Blueprint Reading', 'Team Leadership'],
    experience: '12 years', location: 'Brentwood, CA',
    notes: 'On hold — not currently seeking.',
    addedAt: new Date(Date.now() - 86400000 * 45).toISOString(), resumeUrl: null,
  },
];

export const SEED_COMPANIES: ClientCompany[] = [
  {
    id: 'CLT-001', name: 'Valley Medical Center', industry: 'Healthcare',
    contactName: 'Dr. Amanda Ross', contactEmail: 'aross@valleymedical.com',
    contactPhone: '(916) 555-1001', address: '1234 Health Blvd',
    city: 'Sacramento', state: 'CA', status: 'active',
    since: '2022-03-01', totalPlacements: 12,
    notes: 'Primary healthcare client. Needs RNs quarterly.', openOrders: 2,
  },
  {
    id: 'CLT-002', name: 'TechCorp Solutions', industry: 'Information Technology',
    contactName: 'Brian Chen', contactEmail: 'bchen@techcorp.com',
    contactPhone: '(916) 555-1002', address: '500 Innovation Dr',
    city: 'Fairfield', state: 'CA', status: 'active',
    since: '2023-01-15', totalPlacements: 5,
    notes: 'Fast-growing startup. Needs developers urgently.', openOrders: 1,
  },
  {
    id: 'CLT-003', name: 'Grand Vista Hotel', industry: 'Hospitality',
    contactName: 'Patricia Moore', contactEmail: 'pmoore@grandvista.com',
    contactPhone: '(707) 555-1003', address: '900 Vista Way',
    city: 'Vallejo', state: 'CA', status: 'active',
    since: '2022-06-20', totalPlacements: 8,
    notes: 'Seasonal spikes in summer. Plan ahead.', openOrders: 0,
  },
  {
    id: 'CLT-004', name: 'Delta Manufacturing Co.', industry: 'Manufacturing',
    contactName: 'Gary Mitchell', contactEmail: 'gmitchell@deltamfg.com',
    contactPhone: '(209) 555-1004', address: '3300 Industrial Pkwy',
    city: 'Stockton', state: 'CA', status: 'active',
    since: '2023-04-10', totalPlacements: 6,
    notes: 'Needs machine operators regularly.', openOrders: 1,
  },
  {
    id: 'CLT-005', name: 'Pacific Logistics Group', industry: 'Transportation',
    contactName: 'Kevin Marsh', contactEmail: 'kmarsh@pacificlogistics.com',
    contactPhone: '(925) 555-1005', address: '780 Freeway Blvd',
    city: 'Antioch', state: 'CA', status: 'prospect',
    since: '2025-01-20', totalPlacements: 1,
    notes: 'Trial placement done. Evaluating for contract.', openOrders: 0,
  },
];

export const SEED_JOB_ORDERS: JobOrder[] = [
  {
    id: 'JOB-001', clientId: 'CLT-001', clientName: 'Valley Medical Center',
    title: 'Registered Nurse — ICU', industry: 'Healthcare', type: 'temporary',
    status: 'open', priority: 'urgent', location: 'Sacramento, CA',
    payRate: '$45–$55/hr',
    startDate: new Date(Date.now() + 86400000 * 7).toISOString(),
    description: 'ICU RN needed for 13-week contract. Night shift.',
    requirements: ['Active RN License', 'ICU Experience 2+ yrs', 'BLS/ACLS Certified'],
    openedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    filledAt: null, candidateId: null, candidateName: null,
    notes: '',
  },
  {
    id: 'JOB-002', clientId: 'CLT-002', clientName: 'TechCorp Solutions',
    title: 'Full-Stack Developer', industry: 'Information Technology', type: 'direct_hire',
    status: 'in_progress', priority: 'urgent', location: 'Fairfield, CA',
    payRate: '$90,000–$110,000/yr',
    startDate: new Date(Date.now() + 86400000 * 14).toISOString(),
    description: 'Permanent full-stack dev. React + Node stack.',
    requirements: ['React/TypeScript 3+ yrs', 'Node.js + PostgreSQL', 'Remote-friendly'],
    openedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    filledAt: null, candidateId: 'CND-002', candidateName: 'James Holloway',
    notes: '',
  },
  {
    id: 'JOB-003', clientId: 'CLT-001', clientName: 'Valley Medical Center',
    title: 'CNA — Long-Term Care', industry: 'Healthcare', type: 'temp_to_hire',
    status: 'in_progress', priority: 'standard', location: 'Sacramento, CA',
    payRate: '$22–$26/hr',
    startDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    description: 'CNA for long-term care wing. Temp-to-hire.',
    requirements: ['Active CNA Cert', 'LTC Experience Preferred', 'CPR Certified'],
    openedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    filledAt: null, candidateId: 'CND-007', candidateName: 'Sofia Mendez',
    notes: '',
  },
  {
    id: 'JOB-004', clientId: 'CLT-004', clientName: 'Delta Manufacturing Co.',
    title: 'CNC Machine Operator', industry: 'Manufacturing', type: 'temporary',
    status: 'open', priority: 'standard', location: 'Stockton, CA',
    payRate: '$28–$34/hr',
    startDate: new Date(Date.now() + 86400000 * 10).toISOString(),
    description: 'CNC operator for 6-month contract.',
    requirements: ['CNC Operation 2+ yrs', 'OSHA Certified', 'Blueprint Reading'],
    openedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    filledAt: null, candidateId: null, candidateName: null,
    notes: '',
  },
  {
    id: 'JOB-005', clientId: 'CLT-003', clientName: 'Grand Vista Hotel',
    title: 'Front Desk Manager', industry: 'Hospitality', type: 'direct_hire',
    status: 'filled', priority: 'standard', location: 'Vallejo, CA',
    payRate: '$55,000–$65,000/yr',
    startDate: new Date(Date.now() - 86400000 * 30).toISOString(),
    description: 'Permanent front desk manager.',
    requirements: ['Hotel Management 5+ yrs', 'PMS Systems', 'Team Leadership'],
    openedAt: new Date(Date.now() - 86400000 * 45).toISOString(),
    filledAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    candidateId: 'CND-003', candidateName: 'Diana Cruz',
    notes: '',
  },
];

export const SEED_PLACEMENTS: Placement[] = [
  {
    id: 'PLC-001', candidateId: 'CND-003', candidateName: 'Diana Cruz',
    clientId: 'CLT-003', clientName: 'Grand Vista Hotel',
    jobOrderId: 'JOB-005', role: 'Front Desk Manager', industry: 'Hospitality',
    type: 'direct_hire', status: 'active',
    startDate: new Date(Date.now() - 86400000 * 30).toISOString(),
    endDate: null, payRate: '$60,000/yr',
    notes: 'Excellent fit. Client very satisfied.',
    placedAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
  {
    id: 'PLC-002', candidateId: 'CND-006', candidateName: 'Marcus Williams',
    clientId: 'CLT-005', clientName: 'Pacific Logistics Group',
    jobOrderId: 'JOB-001', role: 'CDL Driver', industry: 'Transportation',
    type: 'temporary', status: 'active',
    startDate: new Date(Date.now() - 86400000 * 14).toISOString(),
    endDate: new Date(Date.now() + 86400000 * 60).toISOString(),
    payRate: '$32/hr', notes: 'Trial placement. Going well so far.',
    placedAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
];

export const SEED_INTERVIEWS: Interview[] = [
  {
    id: 'INT-001', candidateId: 'CND-002', candidateName: 'James Holloway',
    clientId: 'CLT-002', clientName: 'TechCorp Solutions',
    jobOrderId: 'JOB-002', role: 'Full-Stack Developer',
    scheduledAt: new Date(Date.now() + 86400000 * 2).toISOString(),
    type: 'video', status: 'scheduled',
    notes: 'Second round interview. Technical assessment.', outcome: 'pending',
  },
  {
    id: 'INT-002', candidateId: 'CND-007', candidateName: 'Sofia Mendez',
    clientId: 'CLT-001', clientName: 'Valley Medical Center',
    jobOrderId: 'JOB-003', role: 'CNA — Long-Term Care',
    scheduledAt: new Date(Date.now() + 86400000 * 1).toISOString(),
    type: 'in_person', status: 'scheduled',
    notes: 'First interview. Skills assessment included.', outcome: 'pending',
  },
];

export const SEED_ACTIVITY: ActivityEntry[] = [
  {
    id: 'ACT-001', type: 'candidate_added',
    description: 'New candidate added: Maria Santos (RN)',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    entityId: 'CND-001', entityType: 'candidate',
  },
  {
    id: 'ACT-002', type: 'interview_scheduled',
    description: 'Interview scheduled: James Holloway → TechCorp',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    entityId: 'INT-001', entityType: 'interview',
  },
  {
    id: 'ACT-003', type: 'job_order_opened',
    description: 'New job order: ICU RN at Valley Medical Center',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    entityId: 'JOB-001', entityType: 'job_order',
  },
  {
    id: 'ACT-004', type: 'placement_created',
    description: 'Placement: Diana Cruz → Grand Vista Hotel',
    timestamp: new Date(Date.now() - 86400000 * 30).toISOString(),
    entityId: 'PLC-001', entityType: 'placement',
  },
  {
    id: 'ACT-005', type: 'status_changed',
    description: 'Marcus Williams status → Placed',
    timestamp: new Date(Date.now() - 86400000 * 14).toISOString(),
    entityId: 'CND-006', entityType: 'candidate',
  },
];

export const SEED_BLOG_POSTS: BlogPost[] = [
  {
    id: 'POST-001', title: "5 Signs It's Time to Hire a Staffing Partner",
    slug: 'signs-time-to-hire-staffing-partner', category: 'Hiring Strategy',
    excerpt: 'If your team is stretched thin and open roles keep piling up.',
    content: 'Full article content here...', status: 'published',
    publishedAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 32).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'POST-002', title: 'How to Retain Top Talent in a Competitive Market',
    slug: 'retain-top-talent-competitive-market', category: 'Retention',
    excerpt: 'Great hires are only half the equation.',
    content: 'Full article content here...', status: 'published',
    publishedAt: new Date(Date.now() - 86400000 * 60).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 62).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 60).toISOString(),
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'POST-003', title: 'The True Cost of a Bad Hire',
    slug: 'true-cost-of-a-bad-hire', category: 'Hiring Strategy',
    excerpt: "It's more than a wasted paycheck.",
    content: 'Full article content here...', status: 'draft',
    publishedAt: null,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=800&q=80',
  },
];

export const SEED_WEBSITE_CONTENT = {
  hero: {
    headline: 'We connect talent with opportunity.',
    subtext: 'We place the right people in the right roles — across healthcare, hospitality, technology, and seven more industries.',
    ctaPrimary: 'Find Talent',
    ctaSecondary: 'Browse Opportunities',
    location: 'Rio Vista, California — Staffing Partner',
  },
  about: {
    heading: 'Built by people who believe in people.',
    body: 'F&J WorkForce LLC was founded on a simple idea: staffing should feel personal, not transactional.',
    mission: 'To provide innovative and flexible staffing solutions to businesses of all sizes.',
    vision: 'To be the most trusted and preferred staffing partner in California.',
  },
  contact: {
    heading: "Let's Bring Talent and Opportunity Together.",
    subtext: "Whether you're hiring or looking for your next role, we'd love to hear from you.",
    address: 'Rio Vista, California',
    phone: '[Phone TODO]',
    email: '[Email TODO]',
  },
  footer: {
    tagline: 'Bringing talent and opportunity together since day one.',
  },
};

export const initializeData = (): void => {
  if (!localStorage.getItem('fnj_candidates'))
    localStorage.setItem('fnj_candidates', JSON.stringify(SEED_CANDIDATES));
  if (!localStorage.getItem('fnj_companies'))
    localStorage.setItem('fnj_companies', JSON.stringify(SEED_COMPANIES));
  if (!localStorage.getItem('fnj_job_orders'))
    localStorage.setItem('fnj_job_orders', JSON.stringify(SEED_JOB_ORDERS));
  if (!localStorage.getItem('fnj_placements'))
    localStorage.setItem('fnj_placements', JSON.stringify(SEED_PLACEMENTS));
  if (!localStorage.getItem('fnj_interviews'))
    localStorage.setItem('fnj_interviews', JSON.stringify(SEED_INTERVIEWS));
  if (!localStorage.getItem('fnj_activity'))
    localStorage.setItem('fnj_activity', JSON.stringify(SEED_ACTIVITY));
  if (!localStorage.getItem('fnj_blog_posts'))
    localStorage.setItem('fnj_blog_posts', JSON.stringify(SEED_BLOG_POSTS));
  if (!localStorage.getItem('fnj_website_content'))
    localStorage.setItem('fnj_website_content', JSON.stringify(SEED_WEBSITE_CONTENT));
};