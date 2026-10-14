import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShieldCheck, CreditCard } from 'lucide-react';
import { donationApi } from '../../api/donationApi';
import { isValidEmail, isValidIndianPhone, isValidPAN } from '../../utils/validators';
import { formatINR } from '../../utils/formatters';
import { useNotification } from '../../hooks/useNotification';
import Button from '../common/Button';
import Input from '../common/Input';


export default function DonationForm({ projects = [], selectedProjectId = '' }) {
  const navigate = useNavigate();
  const { showError, showSuccess } = useNotification();

  // Preset amounts in INR
  const PRESET_AMOUNTS = [500, 1000, 2500, 5000, 10000];

  const [amount, setAmount] = useState(2500);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [projectId, setProjectId] = useState(selectedProjectId || '');

  // Donor details
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pan: '',
    address: '',
    require80G: true,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const handleAmountSelect = (val) => {
    setIsCustom(false);
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    setCustomAmount(val);
    setIsCustom(true);
    setAmount(val ? Number(val) : 0);
  };

  const validateForm = () => {
    const errs = {};
    const finalAmount = isCustom ? Number(customAmount) : amount;

    if (!finalAmount || finalAmount < 50) {
      errs.amount = 'Minimum donation amount is ₹50';
    }

    if (!formData.name.trim()) {
      errs.name = 'Full name is required';
    }

    if (!formData.email.trim() || !isValidEmail(formData.email)) {
      errs.email = 'Valid email address is required for receipt';
    }

    if (!formData.phone.trim() || !isValidIndianPhone(formData.phone)) {
      errs.phone = 'Valid 10-digit Indian phone number is required';
    }

    if (formData.require80G) {
      if (!formData.pan.trim()) {
        errs.pan = 'PAN Number is required for Section 80G tax deduction';
      } else if (!isValidPAN(formData.pan)) {
        errs.pan = 'Enter valid 10-character PAN format (e.g. ABCDE1234F)';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showError('Please check highlighted fields in the form');
      return;
    }

    const finalAmount = isCustom ? Number(customAmount) : amount;
    setLoading(true);

    try {
      // Step 1: Create Order on Backend
      const orderRes = await donationApi.createOrder({
        amount: finalAmount,
        currency: 'INR',
        donorName: formData.name,
        donorEmail: formData.email,
        donorPhone: formData.phone,
        donorPan: formData.pan.toUpperCase(),
        donorAddress: formData.address,
        projectId: projectId || null,
        require80G: formData.require80G,
      });

      const { orderId, key, donationId } = orderRes.data;

      // Step 2: Configure Razorpay Checkout or fallback test simulator
      if (window.Razorpay) {
        const options = {
          key: key || import.meta.env.VITE_PAYMENT_GATEWAY_KEY,
          amount: finalAmount * 100,
          currency: 'INR',
          name: 'Saraswati Educational & Charitable Trust',
          description: 'Charitable Donation with 80G Benefit',
          order_id: orderId,
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: '#155541',
          },
          handler: async function (response) {
            // Step 3: Backend Verification
            await performVerification({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              donationId,
              amount: finalAmount,
              donorName: formData.name,
              donorPan: formData.pan,
            });
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
              showError('Payment window was closed');
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Fallback demo payment simulator
        setVerifying(true);
        setTimeout(async () => {
          await performVerification({
            razorpay_payment_id: 'pay_demo_' + Date.now(),
            razorpay_order_id: orderId,
            razorpay_signature: 'sig_mock_signature_' + Date.now(),
            donationId,
            amount: finalAmount,
            donorName: formData.name,
            donorPan: formData.pan,
          });
        }, 1500);
      }
    } catch (err) {
      setLoading(false);
      setVerifying(false);
      showError(err?.message || 'Failed to initiate donation order');
    }
  };

  const performVerification = async (verificationPayload) => {
    setVerifying(true);
    try {
      // TEAM RULE: Authoritative confirmation must come from backend verify endpoint
      const verifyRes = await donationApi.verifyPayment(verificationPayload);
      if (verifyRes.success) {
        showSuccess('Payment verified successfully!');
        navigate('/payment-success', {
          state: {
            receipt: verifyRes.data,
            donor: formData,
            amount: verificationPayload.amount,
          },
        });
      } else {
        navigate('/payment-failure', {
          state: { error: verifyRes.message || 'Signature verification failed' },
        });
      }
    } catch (err) {
      navigate('/payment-failure', {
        state: { error: err.message || 'Transaction verification could not be completed' },
      });
    } finally {
      setLoading(false);
      setVerifying(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '680px', margin: '0 auto', padding: '2.5rem' }}>
      {verifying && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(6px)',
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--border-radius-lg)',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary-100)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary-600)',
              marginBottom: '1rem',
            }}
          >
            <ShieldCheck size={36} />
          </div>
          <h3 style={{ marginBottom: '0.5rem' }}>Verifying Donation Record</h3>
          <p style={{ color: 'var(--color-slate-500)', maxWidth: '360px' }}>
            Awaiting authoritative confirmation from SECT Trust accounts server. Please do not refresh.
          </p>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'var(--color-amber-100)',
            color: 'var(--color-amber-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Heart size={22} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.4rem' }}>Make a Tax-Deductible Contribution</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-slate-500)' }}>
            All donations to SECT qualify for 50% deduction under Section 80G of Income Tax Act.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step A: Amount Selector */}
        <div style={{ marginBottom: '1.75rem' }}>
          <label className="form-label" style={{ marginBottom: '0.65rem', display: 'block' }}>
            Select Contribution Amount (INR ₹) <span style={{ color: 'var(--color-danger)' }}>*</span>
          </label>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.65rem', marginBottom: '0.85rem' }}>
            {PRESET_AMOUNTS.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleAmountSelect(val)}
                className={`btn ${!isCustom && amount === val ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '0.95rem', padding: '0.65rem 0.5rem' }}
              >
                {formatINR(val)}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative' }}>
            <span
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-slate-400)',
                fontWeight: 600,
              }}
            >
              ₹
            </span>
            <input
              type="text"
              placeholder="Or enter custom amount in Rupees"
              value={customAmount}
              onChange={handleCustomChange}
              className={`form-input ${errors.amount ? 'error' : ''}`}
              style={{ paddingLeft: '2.2rem' }}
            />
          </div>
          {errors.amount && <div className="form-error">{errors.amount}</div>}
        </div>

        {/* Step B: Project Allocation */}
        <div className="form-group">
          <label className="form-label">Allocate To Initiative (Optional)</label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="form-select"
          >
            <option value="">General Trust Fund (Highest Need)</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--color-slate-200)', margin: '1.75rem 0' }} />

        {/* Step C: Donor Info */}
        <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--color-slate-800)' }}>
          Donor Information & 80G Details
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          <Input
            label="Full Name / Organization"
            placeholder="e.g. Dr. Rajesh Sharma"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            required
          />

          <Input
            label="Email Address (for official receipt)"
            type="email"
            placeholder="rajesh@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          <Input
            label="Mobile Number (10 Digits)"
            type="tel"
            placeholder="9876543210"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            error={errors.phone}
            required
          />

          <Input
            label="PAN Number (Required for 80G Certificate)"
            placeholder="ABCDE1234F"
            value={formData.pan}
            onChange={(e) => setFormData({ ...formData, pan: e.target.value.toUpperCase() })}
            error={errors.pan}
            helperText="Required by IT Dept to generate your Form 10BE certificate"
            required={formData.require80G}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Postal Address (for receipt)</label>
          <textarea
            rows="2"
            className="form-textarea"
            placeholder="City, State, PIN code"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>

        <div
          style={{
            backgroundColor: 'var(--color-primary-50)',
            border: '1px solid var(--color-primary-100)',
            borderRadius: 'var(--border-radius-md)',
            padding: '1rem 1.25rem',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
          }}
        >
          <ShieldCheck size={20} color="var(--color-primary-600)" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
          <div style={{ fontSize: '0.85rem', color: 'var(--color-primary-900)' }}>
            <strong>100% Secure & Verified Payment</strong>
            <br />
            Transactions are processed through encrypted 256-bit payment gateways. Instant digital tax receipt with Trust registration number will be provided upon successful verification.
          </div>
        </div>

        <Button
          type="submit"
          variant="amber"
          size="lg"
          loading={loading}
          icon={CreditCard}
          style={{ width: '100%' }}
        >
          Proceed to Donate {formatINR(isCustom ? Number(customAmount) : amount)}
        </Button>
      </form>
    </div>
  );
}
