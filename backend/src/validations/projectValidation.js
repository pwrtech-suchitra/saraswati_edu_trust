/**
 * Project Validation Schemas (Zod)
 * Author: Suchitra (Backend & Database Developer)
 */

const { z } = require('zod');

const createProjectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(255),
  summary: z.string().min(10, 'Summary must be at least 10 characters').max(500),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category_id: z.coerce.number().int().positive('Valid category ID is required'),
  target_amount: z.coerce.number().min(1, 'Target amount must be greater than 0'),
  beneficiaries: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  is_featured: z.coerce.boolean().optional().default(false)
});

const updateProjectSchema = createProjectSchema.partial();

module.exports = {
  createProjectSchema,
  updateProjectSchema
};
