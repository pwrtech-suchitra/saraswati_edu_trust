import React, { useEffect, useState } from 'react';
import { Download, ShieldCheck } from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import { formatDate, formatINR } from '../../utils/formatters';
import { Spinner } from '../../components/common/Loader';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';

function getCurrentFinancialYearStart() {
  const now = new Date();
  return now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
}

function csvCell(value) {
  const text = String(value ?? '');
  const safeText = /^[\s]*[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safeText.replace(/"/g, '""')}"`;
}

function exportReceipts(records, financialYear) {
  const headers = ['Receipt Number', 'Financial Year', 'Donor Name', 'Donor PAN', 'Amount', 'Donation Date', 'Issued At'];
  const rows = records.map((record) => [
    record.receipt_number,
    record.financial_year,
    record.donor_name,
    record.donor_pan,
    record.amount,
    record.donation_date,
    record.issued_at
  ]);
  const csv = [headers, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `sect-80g-receipts-${financialYear}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function AdminReportsPage() {
  const [report, setReport] = useState(null);
  const [receipts, setReceipts] = useState(null);
  const [fiscalYear, setFiscalYear] = useState(() => getCurrentFinancialYearStart());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const financialYears = Array.from({ length: 10 }, (_, offset) => getCurrentFinancialYearStart() - offset);
  const selectedFinancialYear = `${fiscalYear}-${String(fiscalYear + 1).slice(-2)}`;

  useEffect(() => {
    let active = true;
    async function loadReport() {
      setLoading(true);
      setError('');
      const start = `${fiscalYear}-04-01`;
      const end = `${fiscalYear + 1}-03-31T23:59:59.999Z`;

      try {
        const [donationResponse, receiptResponse] = await Promise.all([
          adminApi.getReports({ from: start, to: end }),
          adminApi.get80GReports(selectedFinancialYear)
        ]);
        if (!donationResponse.success || !receiptResponse.success) {
          throw new Error('The reports could not be loaded.');
        }
        if (active) {
          setReport(donationResponse.data);
          setReceipts(receiptResponse.data);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message || 'The reports could not be loaded.');
          setReport(null);
          setReceipts(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadReport();
    return () => {
      active = false;
    };
  }, [fiscalYear, selectedFinancialYear]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--color-slate-900)' }}>Financial &amp; 80G Donation Reports</h2>
          <p style={{ color: 'var(--color-slate-500)', fontSize: '0.9rem' }}>
            Donation totals and issued 80G receipt records from the database.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <select
            value={fiscalYear}
            onChange={(event) => setFiscalYear(Number(event.target.value))}
            className="form-select"
            style={{ width: 'auto' }}
            aria-label="Financial year"
          >
            {financialYears.map((year) => (
              <option key={year} value={year}>FY {year}-{String(year + 1).slice(-2)}</option>
            ))}
          </select>
          <Button
            variant="primary"
            icon={Download}
            disabled={loading || !receipts?.records?.length}
            onClick={() => exportReceipts(receipts.records, selectedFinancialYear)}
          >
            Export 80G CSV
          </Button>
        </div>
      </div>

      {loading ? (
        <Spinner text="Loading donation reports..." />
      ) : error ? (
        <p role="alert" className="form-error">{error}</p>
      ) : (
        <div>
          <div className="grid grid-cols-2" style={{ marginBottom: '2rem' }}>
            <div className="stat-card">
              <div>
                <div className="stat-value" style={{ color: 'var(--color-primary-700)' }}>
                  {formatINR(report?.total_amount)}
                </div>
                <div className="stat-label">Completed Donations</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-slate-500)' }}>{report?.count || 0} donations</div>
              </div>
            </div>
            <div className="stat-card">
              <div>
                <div className="stat-value" style={{ color: 'var(--color-amber-600)' }}>
                  {formatINR(receipts?.total_amount)}
                </div>
                <div className="stat-label">Issued 80G Receipts</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-slate-500)' }}>{receipts?.count || 0} receipts</div>
              </div>
            </div>
          </div>

          <div className="card card-padded" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <ShieldCheck size={22} color="var(--color-primary-600)" />
              <h3 style={{ fontSize: '1.2rem' }}>Issued 80G Receipts — FY {selectedFinancialYear}</h3>
            </div>
            {receipts?.records?.length ? (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Receipt Number</th>
                      <th>Donor Name</th>
                      <th>PAN</th>
                      <th>Amount</th>
                      <th>Donation Date</th>
                      <th>Issued At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receipts.records.map((receipt) => (
                      <tr key={receipt.receipt_number}>
                        <td>{receipt.receipt_number}</td>
                        <td style={{ fontWeight: 600 }}>{receipt.donor_name}</td>
                        <td style={{ fontFamily: 'monospace' }}>{receipt.donor_pan || '—'}</td>
                        <td style={{ fontWeight: 700, color: 'var(--color-primary-700)' }}>{formatINR(receipt.amount)}</td>
                        <td>{formatDate(receipt.donation_date)}</td>
                        <td>{formatDate(receipt.issued_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState title="No 80G receipts" description={`No issued receipts were found for FY ${selectedFinancialYear}.`} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
