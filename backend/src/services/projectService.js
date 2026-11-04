/**
 * Project Management Service
 * Author: Suchitra (Backend & Database Developer)
 */

const db = require('../config/db');

/**
 * Generate URL-friendly slug
 */
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

/**
 * List projects with filters and pagination
 */
async function getProjects({ category = null, status = null, search = null, page = 1, limit = 9 }) {
  const offset = (page - 1) * limit;
  const whereClauses = ['p.is_deleted = FALSE'];
  const params = [];

  if (category) {
    params.push(category);
    whereClauses.push(`(c.slug = $${params.length} OR c.id::text = $${params.length})`);
  }

  if (status) {
    params.push(status);
    whereClauses.push(`p.status = $${params.length}`);
  }

  if (search) {
    params.push(`%${search}%`);
    whereClauses.push(`(p.title ILIKE $${params.length} OR p.summary ILIKE $${params.length})`);
  }

  const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

  // Get total count
  const countSql = `
    SELECT COUNT(*) as total
    FROM projects p
    LEFT JOIN categories c ON p.category_id = c.id
    ${whereSql}
  `;
  const countRes = await db.query(countSql, params);
  const total = parseInt(countRes.rows[0].total, 10);

  // Get records
  params.push(limit, offset);
  const dataSql = `
    SELECT 
      p.id, p.title, p.slug, p.summary,
      p.beneficiaries, p.location, p.status, p.hero_image_url, p.is_featured, p.created_at,
      c.id as category_id, c.name as category_name, c.slug as category_slug
    FROM projects p
    LEFT JOIN categories c ON p.category_id = c.id
    ${whereSql}
    ORDER BY p.is_featured DESC, p.created_at DESC
    LIMIT $${params.length - 1} OFFSET $${params.length}
  `;
  const dataRes = await db.query(dataSql, params);

  return {
    projects: dataRes.rows,
    meta: {
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      totalPages: Math.ceil(total / limit)
    }
  };
}

/**
 * Get project by ID or slug
 */
async function getProjectByIdOrSlug(identifier) {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
  const condition = isUuid ? 'p.id = $1' : 'p.slug = $1';

  const text = `
    SELECT 
      p.*,
      c.id as category_id, c.name as category_name, c.slug as category_slug
    FROM projects p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE ${condition} AND p.is_deleted = FALSE
  `;
  const res = await db.query(text, [identifier]);

  if (res.rowCount === 0) {
    const error = new Error('Project not found');
    error.statusCode = 404;
    throw error;
  }

  const project = res.rows[0];

  // Fetch project updates & images
  const updatesRes = await db.query(
    'SELECT id, title, content, image_url, created_at FROM project_updates WHERE project_id = $1 ORDER BY created_at DESC',
    [project.id]
  );
  const imagesRes = await db.query(
    'SELECT id, image_url, caption FROM project_images WHERE project_id = $1 ORDER BY display_order ASC',
    [project.id]
  );

  project.updates = updatesRes.rows;
  project.gallery = imagesRes.rows;

  return project;
}

/**
 * Create new project
 */
async function createProject(data, userId = null) {
  let baseSlug = slugify(data.title);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const check = await db.query('SELECT id FROM projects WHERE slug = $1', [slug]);
    if (check.rowCount === 0) break;
    slug = `${baseSlug}-${counter++}`;
  }

  const text = `
    INSERT INTO projects (
      title, slug, summary, description, category_id,
      beneficiaries, location, hero_image_url, is_featured, created_by
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *
  `;
  const res = await db.query(text, [
    data.title,
    slug,
    data.summary,
    data.description,
    data.category_id,
    data.beneficiaries || null,
    data.location || null,
    data.hero_image_url || null,
    data.is_featured || false,
    userId
  ]);

  return res.rows[0];
}

/**
 * Update project
 */
async function updateProject(id, data) {
  const fields = [];
  const values = [];
  let idx = 1;

  const allowed = ['title', 'summary', 'description', 'category_id', 'status', 'beneficiaries', 'location', 'hero_image_url', 'is_featured'];
  for (const key of allowed) {
    if (data[key] !== undefined) {
      fields.push(`${key} = $${idx++}`);
      values.push(data[key]);
    }
  }

  if (fields.length === 0) {
    return await getProjectByIdOrSlug(id);
  }

  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id);

  const text = `
    UPDATE projects
    SET ${fields.join(', ')}
    WHERE id = $${idx} AND is_deleted = FALSE
    RETURNING *
  `;
  const res = await db.query(text, values);
  if (res.rowCount === 0) {
    const error = new Error('Project not found or already deleted');
    error.statusCode = 404;
    throw error;
  }
  return res.rows[0];
}

/**
 * Soft delete project to protect referential integrity
 */
async function deleteProject(id) {
  const text = `
    UPDATE projects
    SET is_deleted = TRUE, deleted_at = CURRENT_TIMESTAMP
    WHERE id = $1 AND is_deleted = FALSE
    RETURNING id, title
  `;
  const res = await db.query(text, [id]);
  if (res.rowCount === 0) {
    const error = new Error('Project not found or already deleted');
    error.statusCode = 404;
    throw error;
  }
  return res.rows[0];
}

module.exports = {
  getProjects,
  getProjectByIdOrSlug,
  createProject,
  updateProject,
  deleteProject
};
