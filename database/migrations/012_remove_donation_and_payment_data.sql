-- Remove donation/payment recording; donations are now handled directly with the
-- trust's QR code and are not submitted to this application.

DROP TABLE IF EXISTS donation_receipts CASCADE;
DROP TABLE IF EXISTS payment_transactions CASCADE;
DROP TABLE IF EXISTS payment_orders CASCADE;
DROP TABLE IF EXISTS donations CASCADE;

ALTER TABLE projects
  DROP COLUMN IF EXISTS target_amount,
  DROP COLUMN IF EXISTS raised_amount;

ALTER TABLE users
  DROP COLUMN IF EXISTS pan_number;

ALTER TABLE trust_profile
  DROP COLUMN IF EXISTS exemption_80g_no,
  DROP COLUMN IF EXISTS qr_code_url;

DELETE FROM audit_logs
WHERE entity_type IN ('donations', 'payment_orders', 'payment_transactions', 'donation_receipts')
   OR action LIKE '%DONATION%'
   OR action LIKE '%PAYMENT%';

DELETE FROM users
WHERE id IN (
  SELECT ur.user_id
  FROM user_roles ur
  JOIN roles r ON r.id = ur.role_id
  WHERE r.name = 'DONOR'
)
AND NOT EXISTS (
  SELECT 1
  FROM user_roles ur
  JOIN roles r ON r.id = ur.role_id
  WHERE ur.user_id = users.id AND r.name <> 'DONOR'
);

DELETE FROM user_roles
WHERE role_id IN (SELECT id FROM roles WHERE name = 'DONOR');

DELETE FROM role_permissions
WHERE permission_id IN (
  SELECT id FROM permissions WHERE code IN ('donations:read', 'reports:view')
);

DELETE FROM permissions
WHERE code IN ('donations:read', 'reports:view');

DELETE FROM roles
WHERE name = 'DONOR';
