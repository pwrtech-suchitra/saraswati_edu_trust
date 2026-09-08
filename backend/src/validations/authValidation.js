/**
 * Authentication Validation Schemas (Zod)
 * Author: Suchitra (Backend & Database Developer)
 */

const { z } = require('zod');

const registerSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters').max(150),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9!@#$%^&*]/, 'Password must contain at least one digit or symbol'),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable()
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

const refreshSchema = z.object({
  refresh_token: z.string().min(1, 'Refresh token is required')
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshSchema
};
