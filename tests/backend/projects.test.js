/**
 * Project Management Unit Tests
 * Author: Suchitra (Backend & Database Developer)
 */

const test = require('node:test');
const assert = require('node:assert');
const { createProjectSchema, updateProjectSchema } = require('../../backend/src/validations/projectValidation');

test('createProjectSchema validates a correct project payload', () => {
  const validProject = {
    title: 'Solar Lighting for Rural Anganwadis',
    summary: 'Installing off-grid solar panels in remote primary education centers across Mayurbhanj district.',
    description: 'This initiative addresses power outages by providing sustainable solar PV systems and battery storage for 25 Anganwadi centers, benefitting over 500 children.',
    category_id: 2,
    beneficiaries: '500+ Rural Children',
    location: 'Mayurbhanj, Odisha',
    is_featured: true
  };

  const parsed = createProjectSchema.safeParse(validProject);
  assert.strictEqual(parsed.success, true);
  assert.strictEqual(parsed.data.title, validProject.title);
  assert.strictEqual(parsed.data.category_id, 2);
});

test('createProjectSchema rejects missing required fields and short strings', () => {
  const invalidProject = {
    title: 'No', // Too short (< 3)
    summary: 'Short', // Too short (< 10)
    description: 'Brief', // Too short (< 20)
    category_id: -1 // Invalid category
  };

  const parsed = createProjectSchema.safeParse(invalidProject);
  assert.strictEqual(parsed.success, false);
  const errorMap = parsed.error.flatten().fieldErrors;
  assert.ok(errorMap.title);
  assert.ok(errorMap.summary);
  assert.ok(errorMap.description);
  assert.ok(errorMap.category_id);
});

test('updateProjectSchema allows partial updates', () => {
  const partialUpdate = { is_featured: false };

  const parsed = updateProjectSchema.safeParse(partialUpdate);
  assert.strictEqual(parsed.success, true);
  assert.strictEqual(parsed.data.is_featured, false);
});

test('createProjectSchema handles camelCase payload from frontend form', () => {
  const camelPayload = {
    title: 'Clean Water Initiative',
    shortDescription: 'Providing RO filtration units to tribal hamlets in Koraput district.',
    categoryId: '3',
    imageUrl: 'https://example.com/water.jpg'
  };

  const parsed = createProjectSchema.safeParse(camelPayload);
  assert.strictEqual(parsed.success, true);
  assert.strictEqual(parsed.data.category_id, 3);
  assert.strictEqual(parsed.data.summary, camelPayload.shortDescription);
  assert.strictEqual(parsed.data.hero_image_url, camelPayload.imageUrl);
});
