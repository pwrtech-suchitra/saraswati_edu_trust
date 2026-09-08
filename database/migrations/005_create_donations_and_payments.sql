-- Migration 005: Donations, Orders, Payment Transactions & 80G Receipts
-- Author: Suchitra (Backend & Database Developer)

CREATE TABLE IF NOT EXISTS donations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) DEFAULT 'INR',
    donor_name VARCHAR(150) NOT NULL,
    donor_email VARCHAR(255) NOT NULL,
    donor_phone VARCHAR(20),
    donor_pan VARCHAR(10),
    donor_address TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    is_80g_claimed BOOLEAN DEFAULT TRUE,
    status VARCHAR(30) DEFAULT 'PENDING', -- 'PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'
    receipt_number VARCHAR(50) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payment_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donation_id UUID REFERENCES donations(id) ON DELETE CASCADE,
    gateway_order_id VARCHAR(100) UNIQUE NOT NULL,
    gateway_name VARCHAR(50) NOT NULL DEFAULT 'RAZORPAY',
    amount_in_paise BIGINT NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    status VARCHAR(30) DEFAULT 'CREATED', -- 'CREATED', 'PAID', 'FAILED'
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donation_id UUID REFERENCES donations(id) ON DELETE CASCADE,
    gateway_payment_id VARCHAR(100) UNIQUE NOT NULL,
    gateway_order_id VARCHAR(100) NOT NULL,
    payment_method VARCHAR(50), -- 'UPI', 'NETBANKING', 'CARD', 'WALLET'
    amount NUMERIC(12, 2) NOT NULL,
    fee NUMERIC(10, 2) DEFAULT 0.00,
    tax NUMERIC(10, 2) DEFAULT 0.00,
    gateway_signature VARCHAR(255),
    webhook_payload JSONB,
    status VARCHAR(30) NOT NULL, -- 'CAPTURED', 'FAILED'
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS donation_receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donation_id UUID UNIQUE REFERENCES donations(id) ON DELETE CASCADE,
    receipt_number VARCHAR(50) UNIQUE NOT NULL,
    donor_name VARCHAR(150) NOT NULL,
    donor_pan VARCHAR(10),
    amount NUMERIC(12, 2) NOT NULL,
    financial_year VARCHAR(10) NOT NULL,
    receipt_data JSONB NOT NULL,
    issued_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_donations_user_id ON donations(user_id);
CREATE INDEX IF NOT EXISTS idx_donations_project_id ON donations(project_id);
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_gateway_order_id ON payment_orders(gateway_order_id);
CREATE INDEX IF NOT EXISTS idx_transactions_payment_id ON payment_transactions(gateway_payment_id);
