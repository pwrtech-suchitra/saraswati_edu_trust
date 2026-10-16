-- Seed 004: Real Projects Aligned with PDF Activity Pillars
-- Author: Suchitra (Backend & Database Developer)

DELETE FROM project_images;
DELETE FROM project_updates;
DELETE FROM projects;

INSERT INTO projects (
    title,
    slug,
    summary,
    description,
    category_id,
    target_amount,
    raised_amount,
    beneficiaries,
    location,
    status,
    hero_image_url,
    is_featured
) VALUES
(
    'Solar Power & Clean Energy for 50 Rural Primary Schools',
    'solar-power-rural-schools',
    'Equipping underprivileged remote schools with off-grid rooftop solar systems, LED lighting, and energy savings assessments.',
    'Many government and rural community schools in remote tribal villages face frequent power outages of 6 to 10 hours daily. In accordance with SECT Environmental Mandates, this project provides complete off-grid 3kW rooftop solar power packs, LED lighting, and computer lab backup for 50 targeted schools, directly impacting over 12,000 tribal children.',
    (SELECT id FROM categories WHERE slug = 'renewable-energy' LIMIT 1),
    1500000.00,
    1125000.00,
    '12,000+ Students across 50 remote tribal schools',
    'Mayurbhanj & Keonjhar Districts, Odisha',
    'ACTIVE',
    'https://thumbs.dreamstime.com/b/group-students-community-members-gathers-outside-school-solar-panels-its-roof-sustainable-finance-project-349517027.jpg',
    TRUE
),
(
    'Mobile Live-stock Hospital for Tribal Villages',
    'mobile-livestock-hospital',
    'Deploying veterinary emergency ambulances providing free diagnosis, vaccination, and improved cattle breed development.',
    'Livestock is the backbone of tribal household economies. As outlined in the SECT Innovative Livelihood Charter, this project deploys fully equipped Mobile Live-stock Hospital ambulances staffed by veterinary doctors to deliver on-call medical care, emergency interventions, and provide improved species of cattle to tribal pastoralists.',
    (SELECT id FROM categories WHERE slug = 'sustainable-livelihood' LIMIT 1),
    1200000.00,
    890000.00,
    '8,500+ Rural Cattle Keepers & Farmers',
    'Sundargarh & Koraput Districts, Odisha',
    'ACTIVE',
    'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80',
    TRUE
),
(
    'Organic Dairy Farm & Agro-Ecological Training Centre',
    'organic-dairy-farm-training-centre',
    'Establishing community-run organic dairy farms, bio-compost generation units, and farmer training centers.',
    'To introduce sustainable and technologically sound systems of agriculture and increase production thereby, SECT is establishing an Organic Dairy Farm & Demonstration Training Centre. Farmers learn low-cost high-yield eco-friendly farming practices, bio-pest management systems, and bio-fertilizer production to eliminate toxic chemical dependency.',
    (SELECT id FROM categories WHERE slug = 'sustainable-livelihood' LIMIT 1),
    950000.00,
    710000.00,
    '1,200 Small & Marginal Farmers',
    'Bhubaneswar & Khordha Rural Wards',
    'ACTIVE',
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    TRUE
),
(
    'Water Harvesting Structures to Check Distress Migration',
    'water-harvesting-check-migration',
    'Constructing community check-dams and percolation ponds providing immediate local employment and round-the-year irrigation.',
    'Water scarcity during post-monsoon months forces entire tribal families into distress labor migration. SECT executes check-dam and water harvesting structure construction under participatory value based community processes, offering immediate village employment while recharging local aquifers.',
    (SELECT id FROM categories WHERE slug = 'environmental-protection' LIMIT 1),
    1400000.00,
    980000.00,
    '4,500 Hamlet Residents across 18 Villages',
    'Kalahandi & Nuapada Districts, Odisha',
    'ACTIVE',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    TRUE
),
(
    'Decentralized Solid Waste & Biogas Recycling Initiative',
    'solid-waste-biogas-recycling',
    'Introducing municipal solid waste recycling technology, community biogas digestion, and source-segregation education.',
    'Executing SECT environmental mandates on Municipal Solid Waste (MSW) management, this project installs decentralized biogas plants and community aerobic composting units, converting domestic biodegradable waste into clean cooking fuel and organic manure while eliminating landfill pollution.',
    (SELECT id FROM categories WHERE slug = 'solid-waste-management' LIMIT 1),
    750000.00,
    520000.00,
    '6,000 Urban & Peri-Urban Households',
    'Kalinga Nagar & Ghatikia Corridor, Bhubaneswar',
    'ACTIVE',
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    FALSE
),
(
    'Dynamic Tribal Girl Education & Clean Energy Scholarships',
    'girls-scholarship-clean-energy',
    'Providing STEM coaching, digital tablets, and merit scholarships for 250 girl students from weaker tribal communities.',
    'To empower backward tribal communities so they play decision-making roles in society, SECT sponsors comprehensive higher secondary and technical education for meritorious girl scholars, alongside solar technician certification courses.',
    (SELECT id FROM categories WHERE slug = 'education' LIMIT 1),
    1000000.00,
    810000.00,
    '250 Meritorious Tribal Girl Scholars',
    'Statewide across Odisha Tribal Belts',
    'ACTIVE',
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    TRUE
);
