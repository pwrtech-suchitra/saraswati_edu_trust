-- Seed 005: Authentic News & Events Aligned with PDF Initiatives
-- Author: Suchitra (Backend & Database Developer)

DELETE FROM event_registrations;
DELETE FROM events;
DELETE FROM news_articles;

INSERT INTO news_articles (
    title,
    slug,
    excerpt,
    content,
    image_url,
    is_published,
    published_at
) VALUES
(
    'SECT Launches "Mission Sustainable India" on 75th Year of Independence',
    'sect-launches-mission-sustainable-india',
    'Marking 75 years of Independence, SECT volunteers nationwide unite under the 5P principle to draft a comprehensive Vision Document for India.',
    'On 15th August 2022, coinciding with 75 years of political Independence, Saraswati Educational & Charitable Trust formally inaugurated Mission Sustainable India. The nationwide initiative unites volunteers across 13 sustainability domains—including Food, Water, Air, Energy, Waste Management, and Governance—anchored upon the 5P principle: Planet, People, Prosperity, Peace & Well-being, and Partnership, with Political Sustainability through Sustainable Governance.',
    '/mission_sustainable_india.jpg',
    TRUE,
    '2022-08-15 10:00:00+05:30'
),
(
    'SECT Deploys Mobile Live-stock Hospital Ambulance for Remote Tribal Belts',
    'sect-deploys-mobile-livestock-hospital',
    'Specialized veterinary mobile clinic provides doorstep treatments, vaccinations, and cattle breed improvement in underserved villages.',
    'Saraswati Educational & Charitable Trust has officially commissioned its first Mobile Live-stock Hospital ambulance service. The initiative delivers veterinary medical care directly to small pastoralists, checks cattle diseases, and trains farmers on animal husbandry, advancing SECT’s Innovative Livelihood mandate.',
    'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80',
    TRUE,
    '2024-11-10 09:30:00+05:30'
),
(
    'Organic Dairy Farm & Agro-Ecological Training Centre Established',
    'organic-dairy-farm-training-centre-established',
    'State-of-the-art demonstration facility promotes bio-compost, bio-pesticides, and zero chemical dependency.',
    'Under its Agricultural Development charter, SECT has established a full-scale Organic, Dairy Farm & Training Centre. Farmers from surrounding Gram Panchayats receive hands-on training on low-cost high-yield eco-friendly agricultural techniques and bio-manure preparation.',
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    TRUE,
    '2025-06-20 14:00:00+05:30'
);

INSERT INTO events (
    title,
    slug,
    description,
    event_date,
    location,
    is_virtual,
    max_participants,
    hero_image_url,
    is_active
) VALUES
(
    'Grassroots Renewable Energy & Energy Auditing Workshop',
    'renewable-energy-auditing-workshop',
    'Comprehensive technical workshop covering solar rooftop sizing, prefeasibility assessments, and bio-energy technologies for community leaders and engineers.',
    '2026-11-15 09:30:00+05:30',
    'SECT Corporate Office, K-8-82, Kalinga Nagar, Bhubaneswar',
    FALSE,
    60,
    'https://thumbs.dreamstime.com/b/group-students-community-members-gathers-outside-school-solar-panels-its-roof-sustainable-finance-project-349517027.jpg',
    TRUE
),
(
    'Sustainable Organic Farming & Bio-Pest Management Masterclass',
    'organic-farming-bio-pest-masterclass',
    'Hands-on field training for smallholders on non-chemical farming, soil moisture retention, and organic dairy management.',
    '2026-12-05 10:00:00+05:30',
    'SECT Organic Demonstration Farm & Training Centre, Khordha',
    FALSE,
    80,
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    TRUE
),
(
    'Gram Panchayat Resource Mobilization & Scheme Awareness Summit',
    'gram-panchayat-resource-mobilization-summit',
    'Workshop empowering village-level para-professionals to link rural families with central and state government grants, subsidies, and welfare schemes.',
    '2026-12-22 10:30:00+05:30',
    'Community Hall, Ghatikia, Bhubaneswar (Online Stream Available)',
    TRUE,
    150,
    'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    TRUE
);
