-- Seed 006: Documents & Media Gallery Aligned with PDF
-- Author: Suchitra (Backend & Database Developer)

DELETE FROM documents;
DELETE FROM media_files;

INSERT INTO documents (
    title,
    file_url,
    file_size_kb,
    doc_type,
    year,
    description
) VALUES
(
    'Profile of Saraswati Educational & Charitable Trust (Official PDF)',
    '/uploads/documents/Profile_of_SECT.pdf',
    1240,
    'POLICY',
    '2026',
    'Authoritative institutional profile document outlining SECT introduction, vision, mission, Mission Sustainable India, and 4 activity pillars.'
),
(
    'Mission Sustainable India — 5P Framework & Vision Document',
    '/uploads/documents/Mission_Sustainable_India_Vision.pdf',
    2150,
    'POLICY',
    '2024',
    'Consolidated national vision document detailing structural changes in governance, 13 sustainability domains, and village de-growth strategies.'
),
(
    'SECT Statutory Tax Registration & 80G Order Certificate',
    '/uploads/documents/SECT_PAN_and_Statutory_Details.pdf',
    680,
    '80G_CERTIFICATE',
    '2025',
    'Statutory certificate verifying Section 80G tax exemption order and registration.'
),
(
    'SECT Annual Financial Audit & Compliance Statement 2024-25',
    '/uploads/documents/SECT_Annual_Audit_2024_25.pdf',
    3420,
    'AUDIT_REPORT',
    '2025',
    'Statutory audited balance sheet, income and expenditure statement, and donor utilization certificates.'
);

INSERT INTO media_files (
    title,
    media_type,
    file_url,
    category,
    caption
) VALUES
(
    'Mission Sustainable India National Launch Emblem',
    'IMAGE',
    '/mission_sustainable_india.jpg',
    'Initiatives',
    'Official emblem of Mission Sustainable India (Lakshya - Shashwat Bharat) launched on 15 August 2022.'
),
(
    'Official SECT Trust Seal & Diya Emblem',
    'IMAGE',
    '/logo.png',
    'Trust',
    'Registered emblem of Saraswati Educational & Charitable Trust, Bhubaneswar.'
),
(
    'Solar Rooftop Electrification at Tribal High School',
    'IMAGE',
    'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    'Renewable Energy',
    'Engineers installing off-grid 3kW solar systems to ensure uninterrupted study hours.'
),
(
    'Mobile Live-stock Hospital in Rural Village',
    'IMAGE',
    'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80',
    'Livelihood',
    'Doorstep emergency veterinary healthcare and cattle immunization camp.'
),
(
    'Organic Demonstration Farm & Bio-Compost Units',
    'IMAGE',
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    'Agriculture',
    'Farmers observing aerobic bio-compost processing and organic dairy techniques.'
),
(
    'Community Water Harvesting Dam Construction',
    'IMAGE',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    'Environment',
    'Participatory water conservation pond recharging groundwater and providing local livelihood.'
);
