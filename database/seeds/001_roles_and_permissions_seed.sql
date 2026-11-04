-- Seed 001: Initial Roles & Permissions
-- Author: Suchitra (Backend & Database Developer)

INSERT INTO roles (id, name, description) VALUES
(1, 'ADMIN', 'Full administrative authority across all modules and reports'),
(2, 'STAFF', 'Content, project, and inquiry management access'),
(3, 'MEMBER', 'Registered community trust member'),
(5, 'VOLUNTEER', 'Registered field/event volunteer')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

SELECT setval('roles_id_seq', (SELECT MAX(id) FROM roles));

INSERT INTO permissions (code, module, description) VALUES
('projects:create', 'projects', 'Create new projects'),
('projects:update', 'projects', 'Update project details and status'),
('projects:delete', 'projects', 'Archive/delete projects'),
('users:manage', 'users', 'Manage system users and assign roles'),
('inquiries:manage', 'inquiries', 'Respond to and update inquiry statuses')
ON CONFLICT (code) DO NOTHING;

-- Grant all permissions to ADMIN (role_id = 1)
INSERT INTO role_permissions (role_id, permission_id)
SELECT 1, id FROM permissions
ON CONFLICT DO NOTHING;
