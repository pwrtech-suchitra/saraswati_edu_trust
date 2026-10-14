-- Seed 008: Authentic Initial Donations & 80G Receipts
-- Author: Suchitra (Backend & Database Developer)

DELETE FROM donation_receipts;
DELETE FROM payment_transactions;
DELETE FROM payment_orders;
DELETE FROM donations;

-- Donation 1
WITH ins_don1 AS (
    INSERT INTO donations (
        project_id,
        amount,
        currency,
        donor_name,
        donor_email,
        donor_phone,
        donor_pan,
        donor_address,
        is_anonymous,
        is_80g_claimed,
        status,
        receipt_number,
        created_at
    ) VALUES (
        (SELECT id FROM projects WHERE slug = 'solar-power-rural-schools' LIMIT 1),
        10000.00,
        'INR',
        'Dr. Rajeshwari Mohanty',
        'rajeshwari.m@example.com',
        '9861234567',
        'ABCPS1234E',
        'Plot 142, Sahid Nagar, Bhubaneswar-751007',
        FALSE,
        TRUE,
        'COMPLETED',
        'SECT/2026-27/00001',
        '2026-09-01 11:30:00+05:30'
    ) RETURNING id, receipt_number, donor_name, donor_pan, amount
)
INSERT INTO donation_receipts (
    donation_id,
    receipt_number,
    donor_name,
    donor_pan,
    amount,
    financial_year,
    receipt_data
)
SELECT 
    id,
    receipt_number,
    donor_name,
    donor_pan,
    amount,
    '2026-27',
    jsonb_build_object(
        'receipt_number', receipt_number,
        'trust_name', 'Saraswati Educational & Charitable Trust',
        'trust_pan', 'ABBTS7158P',
        'donor_name', donor_name,
        'donor_pan', donor_pan,
        'amount', amount,
        'financial_year', '2026-27',
        'status', 'COMPLETED'
    )
FROM ins_don1;

-- Donation 2
WITH ins_don2 AS (
    INSERT INTO donations (
        project_id,
        amount,
        currency,
        donor_name,
        donor_email,
        donor_phone,
        donor_pan,
        donor_address,
        is_anonymous,
        is_80g_claimed,
        status,
        receipt_number,
        created_at
    ) VALUES (
        (SELECT id FROM projects WHERE slug = 'mobile-livestock-hospital' LIMIT 1),
        5000.00,
        'INR',
        'Er. Subrat Kumar Jena',
        'subrat.jena@example.com',
        '9437198765',
        'XYZPS5678B',
        'Lane 4, Khandagiri, Bhubaneswar-751030',
        FALSE,
        TRUE,
        'COMPLETED',
        'SECT/2026-27/00002',
        '2026-09-08 14:15:00+05:30'
    ) RETURNING id, receipt_number, donor_name, donor_pan, amount
)
INSERT INTO donation_receipts (
    donation_id,
    receipt_number,
    donor_name,
    donor_pan,
    amount,
    financial_year,
    receipt_data
)
SELECT 
    id,
    receipt_number,
    donor_name,
    donor_pan,
    amount,
    '2026-27',
    jsonb_build_object(
        'receipt_number', receipt_number,
        'trust_name', 'Saraswati Educational & Charitable Trust',
        'trust_pan', 'ABBTS7158P',
        'donor_name', donor_name,
        'donor_pan', donor_pan,
        'amount', amount,
        'financial_year', '2026-27',
        'status', 'COMPLETED'
    )
FROM ins_don2;

-- Donation 3
WITH ins_don3 AS (
    INSERT INTO donations (
        project_id,
        amount,
        currency,
        donor_name,
        donor_email,
        donor_phone,
        donor_pan,
        donor_address,
        is_anonymous,
        is_80g_claimed,
        status,
        receipt_number,
        created_at
    ) VALUES (
        (SELECT id FROM projects WHERE slug = 'organic-dairy-farm-training-centre' LIMIT 1),
        25000.00,
        'INR',
        'Ananya Pattnaik',
        'ananya.pattnaik@example.com',
        '9861011223',
        'DEFPM9012K',
        'Jaydev Vihar, Bhubaneswar-751013',
        FALSE,
        TRUE,
        'COMPLETED',
        'SECT/2026-27/00003',
        '2026-09-15 16:40:00+05:30'
    ) RETURNING id, receipt_number, donor_name, donor_pan, amount
)
INSERT INTO donation_receipts (
    donation_id,
    receipt_number,
    donor_name,
    donor_pan,
    amount,
    financial_year,
    receipt_data
)
SELECT 
    id,
    receipt_number,
    donor_name,
    donor_pan,
    amount,
    '2026-27',
    jsonb_build_object(
        'receipt_number', receipt_number,
        'trust_name', 'Saraswati Educational & Charitable Trust',
        'trust_pan', 'ABBTS7158P',
        'donor_name', donor_name,
        'donor_pan', donor_pan,
        'amount', amount,
        'financial_year', '2026-27',
        'status', 'COMPLETED'
    )
FROM ins_don3;
