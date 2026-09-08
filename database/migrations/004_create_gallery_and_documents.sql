-- Migration 004: Media Gallery & Documents
-- Author: Suchitra (Backend & Database Developer)

CREATE TABLE IF NOT EXISTS media_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    media_type VARCHAR(20) NOT NULL DEFAULT 'IMAGE', -- 'IMAGE', 'VIDEO'
    file_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    category VARCHAR(100),
    caption TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size_kb INT,
    doc_type VARCHAR(50) NOT NULL, -- 'ANNUAL_REPORT', 'AUDIT_REPORT', 'POLICY', '80G_CERTIFICATE'
    year VARCHAR(10),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_media_category ON media_files(category);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(doc_type);
