-- Seed 003: SECT Philanthropic Program Categories
-- Author: Suchitra (Backend & Database Developer)

INSERT INTO categories (name, slug, description, icon) VALUES
('Education & Skill Training', 'education', 'Scholarships, digital classrooms, and vocational training for underprivileged youth.', 'BookOpen'),
('Renewable Energy & Solar', 'renewable-energy', 'Decentralized solar electrification for rural schools, primary health centers, and community lamps.', 'Sun'),
('Environmental Protection', 'environmental-protection', 'Tree plantation drives, watershed conservation, and biodiversity preservation.', 'Leaf'),
('Sustainable Livelihood & Agriculture', 'sustainable-livelihood', 'Empowering small farmers, women SHGs, organic farming practices, and market linkage.', 'Sprout'),
('Solid-Waste Management', 'solid-waste-management', 'Community composting, plastic recycling drives, and village cleanliness campaigns.', 'Trash2'),
('Community Development & Health', 'community-development', 'Mobile health checkups, clean drinking water filtration units, and disaster relief.', 'HeartHandshake')
ON CONFLICT (slug) DO UPDATE 
SET name = EXCLUDED.name, description = EXCLUDED.description, icon = EXCLUDED.icon;
