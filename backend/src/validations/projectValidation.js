/**
 * Project Validation Schemas (Zod)
 * Author: Suchitra (Backend & Database Developer)
 */

const { z } = require('zod');

const createProjectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(255),
  summary: z.string().min(10, 'Summary must be at least 10 characters').max(500).optional(),
  shortDescription: z.string().optional(),
  description: z.string().min(10).optional(),
  category_id: z.coerce.number().int().positive('Valid category ID is required').optional(),
  categoryId: z.coerce.number().int().positive('Valid category ID is required').optional(),
  beneficiaries: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  is_featured: z.coerce.boolean().optional().default(false),
  hero_image_url: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable()
}).refine(data => Boolean(data.summary || (data.shortDescription && data.shortDescription.length >= 10)), {
  message: 'Summary must be at least 10 characters',
  path: ['summary']
}).refine(data => data.category_id !== undefined || data.categoryId !== undefined, {
  message: 'Valid category ID is required',
  path: ['category_id']
}).transform(data => {
  const summary = data.summary || data.shortDescription;
  return {
    ...data,
    summary,
    description: data.description || summary,
    category_id: data.category_id !== undefined ? data.category_id : data.categoryId,
    hero_image_url: data.hero_image_url || data.imageUrl || null
  };
});

const updateProjectSchema = z.object({
  title: z.string().min(3).max(255).optional(),
  summary: z.string().min(10).max(500).optional(),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  category_id: z.coerce.number().int().positive().optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  status: z.string().optional(),
  beneficiaries: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  is_featured: z.coerce.boolean().optional(),
  hero_image_url: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable()
}).transform(data => ({
  ...data,
  summary: data.summary || data.shortDescription || data.summary,
  description: data.description || (data.shortDescription ? data.shortDescription : data.description),
  category_id: data.category_id !== undefined ? data.category_id : data.categoryId,
  hero_image_url: data.hero_image_url !== undefined ? data.hero_image_url : data.imageUrl
}));

module.exports = {
  createProjectSchema,
  updateProjectSchema
};
