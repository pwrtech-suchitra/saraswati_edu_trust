-- Migration 009: Remove Sensitive Banking Credentials from Trust Profile
-- Author: Suchitra (Backend & Database Developer)
-- Sanitizes database by removing bank name, branch, account number, and IFSC code

ALTER TABLE trust_profile DROP COLUMN IF EXISTS bank_name;
ALTER TABLE trust_profile DROP COLUMN IF EXISTS branch_name;
ALTER TABLE trust_profile DROP COLUMN IF EXISTS account_number;
ALTER TABLE trust_profile DROP COLUMN IF EXISTS ifsc_code;
