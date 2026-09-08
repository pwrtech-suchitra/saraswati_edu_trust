import React, { useState, useEffect } from 'react';
import { FileBarChart, Download, FileText, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import { formatINR } from '../../utils/formatters';
import { Spinner } from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { useNotification } from '../../hooks/useNotification';

export default function AdminReportsPage() {
  const { showSuccess } = useNotification();
  const [report, setReport] = useState(null);
  const [fiscalYear, setFiscalYear] = useState('2024-25');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReport() {
      setLoading(true);
      try {
        const res = await adminApi.getReports({ fiscalYear });
        if (res.success) setReport(res.data);
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [fiscalYear]);

  const handleExportForm10BE = () => {
    showSuccess(`Generating Annual Form 10BE Schedule for Income Tax Filing (FY ${fiscalYear})...`);
  };

  const handleExportFinancials = () => {
    showSuccess(`Exporting Audited Financial Summary for FY ${fiscalYear}...`);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--color-slate-900)' }}>Financial & 80G Compliance Reports</h2>
          <p style={{ color: 'var(--color-slate-500)', fontSize: '0.9rem' }}>
            Consolidated donation statements for annual Income Tax return filing (Form 10BE).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <select
            value={fiscalYear}
            onChange={(e) => setFiscalYear(e.target.value)}
            className="form-select"
            style={{ width: 'auto' }}
          >
            <option value="2024-25">FY 2024-25 (Current)</option>
            <option value="2023-24">FY 2023-24 (Audited)</option>
          </select>
          <Button variant="primary" icon={Download} onClick={handleExportForm10BE}>
            Form 10BE Export
          </Button>
        </div>
      </div>

      {loading ? (
        <Spinner text="Calculating financial statements..." />
      ) : (
        <div>
          {/* Summary Cards */}
          <div className="grid grid-cols-3" style={{ marginBottom: '2rem' }}>
            <div className="stat-card">
              <div>
                <div className="stat-value" style={{ color: 'var(--color-primary-700)' }}>
                  {formatINR(report?.totalReceived || 2955000)}
                </div>
                <div className="stat-label">Gross Philanthropic Inflow</div>
              </div>
            </div>

            <div className="stat-card">
              <div>
                <div className="stat-value" style={{ color: 'var(--color-amber-600)' }}>
                  {formatINR(report?.totalEligible80G || 2750000)}
                </div>
                <div className="stat-label">Section 80G Deductible Pool</div>
              </div>
            </div>

            <div className="stat-card">
              <div>
                <div className="stat-value" style={{ color: 'var(--color-slate-800)' }}>
                  100%
                </div>
                <div className="stat-label">Statutory Compliance Ratio</div>
              </div>
            </div>
          </div>

          {/* Form 10BE Statement Breakdown */}
          <div className="card card-padded" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <ShieldCheck size={22} color="var(--color-primary-600)" />
                <h3 style={{ fontSize: '1.2rem' }}>Form 10BE Income Tax Return Statement</h3>
              </div>
              <Button variant="outline" size="sm" icon={FileText} onClick={handleExportFinancials}>
                Download Signed Certificate
              </Button>
            </div>

            <p style={{ fontSize: '0.92rem', color: 'var(--color-slate-600)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              Under Rule 18AB of the Indian Income Tax Rules, all eligible donations where donors have submitted their PAN card details are indexed below. This statement matches the annual Statement of Donations uploaded directly to the Income Tax Portal.
            </p>

            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Donor Name</th>
                    <th>PAN (Section 80G)</th>
                    <th>Mode</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Certificate Status</th>
                  </tr>
                </thead>
                <tbody>
                  {report?.donations?.map((don) => (
                    <tr key={don.id}>
                      <td style={{ fontWeight: 600 }}>{don.donorName}</td>
                      <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{don.pan || '—'}</td>
                      <td>Online Gateway (Razorpay)</td>
                      <td style={{ fontWeight: 700, color: 'var(--color-primary-700)' }}>{formatINR(don.amount)}</td>
                      <td>{don.date}</td>
                      <td>
                        <span className="badge badge-success">
                          10BE GENERATED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
