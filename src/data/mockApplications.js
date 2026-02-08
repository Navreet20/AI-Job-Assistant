export const mockApplications = [
  {
    id: 1,
    company: 'Google',
    role: 'Senior Frontend Engineer',
    status: 'Interview Requested',
    date: '2024-01-15',
    logo: '🔍',
    location: 'Mountain View, CA',
    salary: '$150k - $200k',
    appliedVia: 'Company Website'
  },
  {
    id: 2,
    company: 'Stripe',
    role: 'React Developer',
    status: 'Submitted',
    date: '2024-01-14',
    logo: '💳',
    location: 'Remote',
    salary: '$130k - $160k',
    appliedVia: 'LinkedIn'
  },
  {
    id: 3,
    company: 'Netflix',
    role: 'Frontend Architect',
    status: 'Onsite/Video Interview Requested',
    date: '2024-01-12',
    logo: '🎬',
    location: 'Los Gatos, CA',
    salary: '$180k - $250k',
    appliedVia: 'Referral'
  },
  {
    id: 4,
    company: 'Spotify',
    role: 'UI Engineer',
    status: 'Not Submitted yet',
    date: '2024-01-10',
    logo: '🎵',
    location: 'New York, NY',
    salary: '$120k - $150k',
    appliedVia: 'Indeed'
  },
  {
    id: 5,
    company: 'Airbnb',
    role: 'Frontend Engineer',
    status: 'Offer Received',
    date: '2024-01-08',
    logo: '🏠',
    location: 'San Francisco, CA',
    salary: '$160k - $210k',
    appliedVia: 'Company Website'
  },
  {
    id: 6,
    company: 'Meta',
    role: 'Software Engineer (Frontend)',
    status: 'Rejected after Interview',
    date: '2024-01-05',
    logo: '👥',
    location: 'Menlo Park, CA',
    salary: '$140k - $180k',
    appliedVia: 'LinkedIn'
  },
  {
    id: 7,
    company: 'Vercel',
    role: 'Developer Relations',
    status: 'Received Initial Response',
    date: '2024-01-13',
    logo: '▲',
    location: 'Remote',
    salary: '$130k - $170k',
    appliedVia: 'Twitter'
  },
  {
    id: 8,
    company: 'Figma',
    role: 'Frontend Engineer',
    status: 'Declined',
    date: '2024-01-11',
    logo: '🎨',
    location: 'San Francisco, CA',
    salary: '$140k - $190k',
    appliedVia: 'AngelList'
  }
];

export const statusFlow = [
  'Not Submitted yet',
  'Submitted', 
  'Received Initial Response',
  'Interview Requested',
  'Onsite/Video Interview Requested',
  'Offer Received',
  'Rejected after Interview',
  'Declined'
];

export const getStatusColor = (status) => {
  const colors = {
    'Not Submitted yet': '#94a3b8',
    'Submitted': '#3b82f6',
    'Received Initial Response': '#8b5cf6',
    'Interview Requested': '#f59e0b',
    'Onsite/Video Interview Requested': '#ec4899',
    'Offer Received': '#10b981',
    'Rejected after Interview': '#ef4444',
    'Declined': '#6b7280'
  };
  return colors[status] || '#94a3b8';
};

export const calculateStats = (applications) => {
  return {
    total: applications.length,
    active: applications.filter(a => 
      !['Rejected after Interview', 'Declined', 'Offer Received'].includes(a.status)
    ).length,
    interviews: applications.filter(a => 
      a.status.includes('Interview')
    ).length,
    offers: applications.filter(a => 
      a.status === 'Offer Received'
    ).length,
    responseRate: Math.round(
      (applications.filter(a => a.status !== 'Not Submitted yet').length / applications.length) * 100
    )
  };
};