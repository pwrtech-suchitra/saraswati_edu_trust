/**
 * Initial Mock Data for SECT (Saraswati Educational & Charitable Trust)
 * Provides realistic philanthropic initiatives, projects, events, media, and documents
 * used as seamless fallback when backend is in development.
 */

export const mockCategories = [
  { id: '1', name: 'Education & Child Welfare', slug: 'education', description: 'Providing scholarships, rural school support, and literacy drives' },
  { id: '2', name: 'Renewable & Solar Energy', slug: 'renewable-energy', description: 'Solar micro-grids, solar street lights, and clean energy adoption' },
  { id: '3', name: 'Sustainable Livelihood', slug: 'livelihood', description: 'Vocational training, women self-help groups, and organic farming' },
  { id: '4', name: 'Solid Waste & Environment', slug: 'waste-management', description: 'Community composting, tree plantations, and river restoration' },
];

export const mockProjects = [
  {
    id: 'proj-101',
    title: 'Solar Power for 50 Rural Primary Schools',
    slug: 'solar-power-rural-schools',
    category: 'Renewable & Solar Energy',
    categoryId: '2',
    shortDescription: 'Equipping underprivileged remote schools with off-grid rooftop solar systems to ensure uninterrupted study hours and computer education.',
    description: 'Many government and rural community schools in remote villages face frequent power outages of 6 to 10 hours daily. This project provides complete off-grid 3kW rooftop solar power packs, LED lighting, and computer lab backup for 50 targeted schools, directly impacting over 12,000 children.',
    targetAmount: 1500000,
    raisedAmount: 1125000,
    donorCount: 340,
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    status: 'ACTIVE',
    startDate: '2025-01-15',
    endDate: '2025-12-31',
    impactMetrics: [
      { label: 'Schools Empowered', value: '38/50' },
      { label: 'Students Benefited', value: '9,400+' },
      { label: 'CO2 Offset', value: '45 Tons/yr' }
    ]
  },
  {
    id: 'proj-102',
    title: 'Saraswati Girls Higher Education Scholarship Fund',
    slug: 'girls-education-scholarship',
    category: 'Education & Child Welfare',
    categoryId: '1',
    shortDescription: 'Providing tuition fees, STEM learning kits, and mentorship for 200 meritorious young women from economically weaker sections.',
    description: 'Higher secondary dropout rates among girls in rural districts remain high due to financial stress. The SECT Girls Higher Education Scholarship guarantees college tuition, books, digital tablets, and career counselling to break the cycle of poverty.',
    targetAmount: 1000000,
    raisedAmount: 780000,
    donorCount: 215,
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    status: 'ACTIVE',
    startDate: '2025-03-01',
    endDate: '2025-11-30',
    impactMetrics: [
      { label: 'Scholarships Awarded', value: '142/200' },
      { label: 'Pass Rate', value: '98.5%' },
      { label: 'Colleges Enrolled', value: '28' }
    ]
  },
  {
    id: 'proj-103',
    title: 'Women Weavers Organic Khadi Cooperative',
    slug: 'women-weavers-khadi',
    category: 'Sustainable Livelihood',
    categoryId: '3',
    shortDescription: 'Revitalizing traditional handloom weaving and training 150 rural artisan women with modern eco-friendly natural dye techniques.',
    description: 'Empowering women artisans with improved loom infrastructure, fair-wage market linkage, and sustainable organic cotton cultivation. Each artisan achieves financial independence and dignified household sustenance.',
    targetAmount: 850000,
    raisedAmount: 620000,
    donorCount: 180,
    imageUrl: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=800&q=80',
    status: 'ACTIVE',
    startDate: '2025-02-10',
    endDate: '2025-10-31',
    impactMetrics: [
      { label: 'Artisans Trained', value: '110' },
      { label: 'Monthly Income Incr.', value: '+140%' },
      { label: 'Exhibitions Held', value: '12' }
    ]
  },
  {
    id: 'proj-104',
    title: 'Zero-Waste Decentralized Community Composting',
    slug: 'zero-waste-community-composting',
    category: 'Solid Waste & Environment',
    categoryId: '4',
    shortDescription: 'Converting 5 tons of daily domestic wet waste into nutrient-rich organic fertilizer across 10 peri-urban wards.',
    description: 'Eliminating illegal garbage dumps and open burning by establishing ward-level decentralized aerobic composting units and engaging green volunteers for source-segregation education.',
    targetAmount: 600000,
    raisedAmount: 430000,
    donorCount: 130,
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    status: 'ACTIVE',
    startDate: '2025-04-01',
    endDate: '2025-12-15',
    impactMetrics: [
      { label: 'Daily Waste Diverted', value: '3.8 Tons' },
      { label: 'Compost Produced', value: '45 Tons' },
      { label: 'Households Involved', value: '4,200' }
    ]
  }
];

export const mockNews = [
  {
    id: 'news-1',
    title: 'SECT Inaugurates 15 New Solar Classrooms in Mayurbhanj District',
    date: '2025-08-20',
    category: 'Renewable Energy',
    summary: 'Trustees and community leaders dedicated 15 solar-powered classrooms equipped with digital interactive panels.',
    content: 'On Tuesday, Saraswati Educational & Charitable Trust held a dedication ceremony for 15 newly energized primary schools. The initiative was made possible by generous contributions from individual donors and corporate CSR partners.'
  },
  {
    id: 'news-2',
    title: 'Annual 80G Tax Exemption Certificates Dispatched to All Donors',
    date: '2025-07-15',
    category: 'Compliance',
    summary: 'Trust accounts department confirms all eligible donations for the financial year received official 80G receipts.',
    content: 'SECT maintains 100% financial transparency. All donors who made contributions with PAN numbers can download their signed Form 10BE from the donor portal.'
  }
];

export const mockEvents = [
  {
    id: 'ev-1',
    title: 'State-wide Mega Tree Plantation & Bio-Diversity Drive',
    date: '2025-09-25',
    time: '08:00 AM - 01:00 PM',
    location: 'Bhubaneswar Green Belt & Community Forests',
    seatsAvailable: 85,
    description: 'Join 500+ volunteers planting 10,000 indigenous saplings along designated riverbanks and educational campuses.'
  },
  {
    id: 'ev-2',
    title: 'Youth Solar Technician Skill Workshop',
    date: '2025-10-12',
    time: '10:00 AM - 04:00 PM',
    location: 'SECT Vocational Training Centre, Cuttack',
    seatsAvailable: 40,
    description: 'Free hands-on technical workshop on solar panel maintenance, inverter cabling, and safety certifications.'
  }
];

export const mockDocuments = [
  { id: 'doc-1', title: 'SECT Annual Audit & Financial Report 2023-24', year: '2024', type: 'PDF', size: '2.4 MB', fileUrl: '#' },
  { id: 'doc-2', title: '80G Income Tax Exemption Order & Verification', year: '2024', type: 'PDF', size: '850 KB', fileUrl: '#' },
  { id: 'doc-3', title: 'Trust Deed Registration & MoA Document', year: '2023', type: 'PDF', size: '3.1 MB', fileUrl: '#' },
  { id: 'doc-4', title: 'SECT Environmental Impact Assessment 2024', year: '2024', type: 'PDF', size: '1.8 MB', fileUrl: '#' }
];

export const mockGallery = [
  { id: 'gal-1', title: 'Solar installation team at Government High School', category: 'Energy', imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80' },
  { id: 'gal-2', title: 'Girl scholars receiving STEM science kits', category: 'Education', imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80' },
  { id: 'gal-3', title: 'Women artisan cooperative producing natural dyes', category: 'Livelihood', imageUrl: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=800&q=80' },
  { id: 'gal-4', title: 'Community composting organic vegetable garden', category: 'Environment', imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80' }
];

export const mockDonationsList = [
  { id: 'DON-8910', donorName: 'Rajesh Sharma', email: 'rajesh.sharma@example.com', amount: 5000, projectTitle: 'Solar Power for 50 Rural Primary Schools', status: 'COMPLETED', date: '2025-09-02', pan: 'ABCPS1234E' },
  { id: 'DON-8911', donorName: 'Ananya Pattnaik', email: 'ananya.p@example.com', amount: 10000, projectTitle: 'Girls Higher Education Scholarship', status: 'COMPLETED', date: '2025-09-03', pan: 'XYZPA5678B' },
  { id: 'DON-8912', donorName: 'Vikram Mohanty', email: 'vikram.m@example.com', amount: 2500, projectTitle: 'General Trust Fund', status: 'COMPLETED', date: '2025-09-04', pan: 'DEFPM9012K' },
  { id: 'DON-8913', donorName: 'Suman Roy', email: 'suman.roy@example.com', amount: 1000, projectTitle: 'Women Weavers Organic Khadi', status: 'PENDING', date: '2025-09-05', pan: '' },
];
