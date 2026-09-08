/**
 * Contact Inquiry & Volunteer Validation Schemas (Zod)
 * Author: Suchitra (Backend & Database Developer)
 */

const { z } = require('zod');

const contactInquirySchema = z.object({
  name: z.string().min(2, 'Name is required').max(150),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional().nullable(),
  subject: z.string().max(200).optional().nullable(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000)
});

const volunteerApplicationSchema = z.object({
  full_name: z.string().min(2, 'Full name is required').max(150),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  interests: z.array(z.string()).optional().default([]),
  availability: z.string().optional().nullable(),
  experience: z.string().optional().nullable()
});

const eventRegistrationSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional().nullable()
});

module.exports = {
  contactInquirySchema,
  volunteerApplicationSchema,
  eventRegistrationSchema
};
