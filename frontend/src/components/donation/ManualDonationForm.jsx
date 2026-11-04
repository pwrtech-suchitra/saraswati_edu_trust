import React, { useState } from 'react';
import { ClipboardCheck } from 'lucide-react';
import { manualDonationApi } from '../../api/manualDonationApi';
import { useNotification } from '../../hooks/useNotification';
import Button from '../common/Button';
import Input from '../common/Input';

const emptyForm = {
  amount: '',
  donorName: '',
  donorEmail: '',
  donorPhone: '',
  donorPan: '',
  donorAddress: '',
  paymentReference: '',
  require80G: false
};

export default function ManualDonationForm({ has80GRegistration, projectId = null }) {
  const { showError, showSuccess } = useNotification();
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submission, setSubmission] = useState(null);

  function updateField(event) {
    const { name, value, checked, type } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : name === 'donorPan' ? value.toUpperCase() : value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setSubmission(null);

    try {
      const response = await manualDonationApi.submit({
        ...form,
        amount: Number(form.amount),
        projectId,
        require80G: form.require80G && has80GRegistration,
        donorPan: form.require80G ? form.donorPan : null
      });
      setSubmission(response.data);
      setForm(emptyForm);
      showSuccess('Your UPI transfer details were submitted for review.');
    } catch (error) {
      showError(error.message || 'Could not submit your UPI transfer details.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submission) {
    return (
      <div role="status" className="alert alert-info" style={{ marginTop: '1.5rem' }}>
        <ClipboardCheck size={20} />
        <div>
          <strong>Submission received for reconciliation.</strong>
          <p>Reference: {submission.donation_id}</p>
          <p>This is not payment confirmation or a receipt. The Trust will confirm the transfer against its bank records.</p>
          <button type="button" className="btn btn-outline btn-sm" style={{ marginTop: '0.75rem' }} onClick={() => setSubmission(null)}>
            Submit another transfer
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="manual-donation-form">
      <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>Report a UPI transfer</h3>
      <p style={{ fontSize: '0.82rem', marginBottom: '1rem' }}>
        Submit the transaction reference shown by your UPI app. The Trust checks it against bank records before confirming.
      </p>
      <div className="form-group">
        <label className="form-label" htmlFor="manual-donation-amount">Amount paid (INR)</label>
        <Input id="manual-donation-amount" name="amount" type="number" min="50" step="0.01" required value={form.amount} onChange={updateField} placeholder="Minimum ₹50" />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="manual-donation-reference">UPI transaction reference</label>
        <Input id="manual-donation-reference" name="paymentReference" required minLength={6} maxLength={100} value={form.paymentReference} onChange={updateField} placeholder="Reference / UTR from your app" autoComplete="off" />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="manual-donation-name">Full name</label>
        <Input id="manual-donation-name" name="donorName" required minLength={2} maxLength={150} value={form.donorName} onChange={updateField} autoComplete="name" />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="manual-donation-email">Email</label>
        <Input id="manual-donation-email" name="donorEmail" type="email" required maxLength={255} value={form.donorEmail} onChange={updateField} autoComplete="email" />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="manual-donation-phone">Mobile number (optional)</label>
        <Input id="manual-donation-phone" name="donorPhone" type="tel" value={form.donorPhone} onChange={updateField} autoComplete="tel" />
      </div>
      {has80GRegistration && <label className="manual-donation-80g">
        <input type="checkbox" name="require80G" checked={form.require80G} onChange={updateField} />
        <span>Request 80G documentation (PAN required)</span>
      </label>}
      {form.require80G && has80GRegistration && <div className="form-group">
        <label className="form-label" htmlFor="manual-donation-pan">PAN</label>
        <Input id="manual-donation-pan" name="donorPan" required pattern="[A-Z]{5}[0-9]{4}[A-Z]" maxLength={10} value={form.donorPan} onChange={updateField} autoComplete="off" />
      </div>}
      <div className="form-group">
        <label className="form-label" htmlFor="manual-donation-address">Postal address (optional)</label>
        <textarea id="manual-donation-address" name="donorAddress" className="form-textarea" maxLength={1000} value={form.donorAddress} onChange={updateField} autoComplete="street-address" rows="3" />
      </div>
      <Button type="submit" variant="primary" loading={submitting} style={{ width: '100%' }}>
        Submit transfer details
      </Button>
    </form>
  );
}