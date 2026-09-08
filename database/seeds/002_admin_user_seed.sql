-- Seed 002: Default SECT Administrator
-- Password: AdminPassword123!
-- Author: Suchitra (Backend & Database Developer)

INSERT INTO users (id, full_name, email, password_hash, phone, is_active)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'SECT Trust Administrator',
    'admin@sect.org',
    '$2a$10$w1QO2Z1F0qN2n4u6S8e0xO1aZ9bK8kLmNpQrStUvWxYz012345678', -- Placeholder/dev hash (will be initialized via auth service)
    '9876543210',
    TRUE
)
ON CONFLICT (email) DO NOTHING;

INSERT INTO user_roles (user_id, role_id)
VALUES ('00000000-0000-0000-0000-000000000001', 1)
ON CONFLICT DO NOTHING;
