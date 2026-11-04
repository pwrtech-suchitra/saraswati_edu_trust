ALTER TABLE donations
  ADD COLUMN IF NOT EXISTS payment_method VARCHAR(20),
  ADD COLUMN IF NOT EXISTS payment_reference VARCHAR(100);

CREATE UNIQUE INDEX IF NOT EXISTS idx_donations_unique_upi_reference
  ON donations (UPPER(payment_reference))
  WHERE payment_method = 'UPI_QR' AND payment_reference IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_donations_manual_review
  ON donations (status, created_at DESC)
  WHERE payment_method = 'UPI_QR';