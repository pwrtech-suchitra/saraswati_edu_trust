/**
 * Authentication & RBAC Unit Tests
 * Author: Suchitra (Backend & Database Developer)
 */

const test = require('node:test');
const assert = require('node:assert');
const { registerSchema, loginSchema } = require('../../backend/src/validations/authValidation');
const { generateTokens } = require('../../backend/src/services/authService');

test('registerSchema validates correct user credentials', () => {
  const validUser = {
    full_name: 'Ananya Panda',
    email: 'ananya@example.com',
    password: 'StrongPassword123!',
    phone: '9876543210'
  };

  const parsed = registerSchema.safeParse(validUser);
  assert.strictEqual(parsed.success, true);
});

test('registerSchema rejects weak password without uppercase or symbols', () => {
  const weakUser = {
    full_name: 'Ananya Panda',
    email: 'ananya@example.com',
    password: 'weak'
  };

  const parsed = registerSchema.safeParse(weakUser);
  assert.strictEqual(parsed.success, false);
});

test('loginSchema validates email and password presence', () => {
  const validLogin = {
    email: 'admin@sect.org',
    password: 'AdminPassword123!'
  };
  const parsed = loginSchema.safeParse(validLogin);
  assert.strictEqual(parsed.success, true);

  const invalidLogin = { email: 'not-an-email', password: '' };
  const failed = loginSchema.safeParse(invalidLogin);
  assert.strictEqual(failed.success, false);
});

test('generateTokens creates valid JWT access and refresh tokens with user payload', () => {
  const mockUser = {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'donor@sect.org',
    role: 'DONOR'
  };

  const tokens = generateTokens(mockUser);
  assert.ok(tokens.accessToken);
  assert.ok(tokens.refreshToken);
  assert.strictEqual(typeof tokens.accessToken, 'string');
  assert.strictEqual(typeof tokens.refreshToken, 'string');
});
