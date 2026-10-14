-- Migration 008: Trust Profile, Financial Particulars, Mission Sustainable India & Activity Pillars
-- Author: Suchitra (Backend & Database Developer)

CREATE TABLE IF NOT EXISTS trust_profile (
    id SERIAL PRIMARY KEY,
    trust_name VARCHAR(255) NOT NULL,
    short_name VARCHAR(50) NOT NULL,
    pan VARCHAR(20) NOT NULL,
    registration_no VARCHAR(100),
    exemption_80g_no VARCHAR(100),
    address TEXT NOT NULL,
    city VARCHAR(100) DEFAULT 'Bhubaneswar',
    state VARCHAR(100) DEFAULT 'Odisha',
    pincode VARCHAR(20) DEFAULT '751029',
    phone_landline VARCHAR(50),
    phone_mobiles TEXT[],
    email VARCHAR(255) NOT NULL,
    qr_code_url VARCHAR(255) DEFAULT '/qr_code.png',
    facebook_url VARCHAR(255),
    twitter_handle VARCHAR(100),
    linkedin_url VARCHAR(255),
    whatsapp_numbers TEXT[],
    introduction TEXT NOT NULL,
    vision TEXT NOT NULL,
    mission TEXT NOT NULL,
    mission_sustainable_india JSONB NOT NULL,
    activity_pillars JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_trust_profile_active ON trust_profile(is_active);
