-- Migration 010: Create baseline RBAC roles and administrator permissions.

INSERT INTO roles (name, description) VALUES
  ('ADMIN', 'Full administrative authority across all modules and reports'),
  ('STAFF', 'Content, project, and inquiry management access'),
  ('MEMBER', 'Registered community trust member'),
  ('DONOR', 'Supporter with donation history and 80G receipt access'),
  ('VOLUNTEER', 'Registered field/event volunteer')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description;

INSERT INTO permissions (code, module, description) VALUES
  ('projects:create', 'projects', 'Create new projects'),
  ('projects:update', 'projects', 'Update project details and status'),
  ('projects:delete', 'projects', 'Archive/delete projects'),
  ('donations:read', 'donations', 'View donation records and tax receipts'),
  ('reports:view', 'reports', 'View analytical and financial reports'),
  ('users:manage', 'users', 'Manage system users and assign roles'),
  ('inquiries:manage', 'inquiries', 'Respond to and update inquiry statuses')
ON CONFLICT (code) DO NOTHING;

INSERT INTO role_permissions (role_id, permission_id)
SELECT roles.id, permissions.id
FROM roles
CROSS JOIN permissions
WHERE roles.name = 'ADMIN'
ON CONFLICT DO NOTHING;
