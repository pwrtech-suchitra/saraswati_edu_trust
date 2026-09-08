/**
 * News & Events Controller
 * Author: Suchitra (Backend & Database Developer)
 */

const db = require('../config/db');
const ApiResponse = require('../utils/apiResponse');

// --- NEWS ---
async function listNews(req, res, next) {
  try {
    const { page = 1, limit = 6 } = req.query;
    const offset = (page - 1) * limit;

    const countRes = await db.query('SELECT COUNT(*) as total FROM news_articles WHERE is_published = TRUE');
    const total = parseInt(countRes.rows[0].total, 10);

    const dataRes = await db.query(`
      SELECT id, title, slug, excerpt, image_url, published_at, created_at
      FROM news_articles
      WHERE is_published = TRUE
      ORDER BY published_at DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    return ApiResponse.success(res, 'News articles retrieved', dataRes.rows, {
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    next(err);
  }
}

async function getNewsArticle(req, res, next) {
  try {
    const { id } = req.params;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const condition = isUuid ? 'id = $1' : 'slug = $1';

    const result = await db.query(`SELECT * FROM news_articles WHERE ${condition} AND is_published = TRUE`, [id]);
    if (result.rowCount === 0) {
      return ApiResponse.error(res, 'Article not found', [], 404);
    }
    return ApiResponse.success(res, 'Article retrieved', result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// --- EVENTS ---
async function listEvents(req, res, next) {
  try {
    const result = await db.query(`
      SELECT 
        id, title, slug, description, event_date, location, is_virtual, max_participants, hero_image_url,
        (SELECT COUNT(*) FROM event_registrations WHERE event_id = events.id) as registered_count
      FROM events
      WHERE is_active = TRUE
      ORDER BY event_date ASC
    `);
    return ApiResponse.success(res, 'Events retrieved', result.rows);
  } catch (err) {
    next(err);
  }
}

async function getEvent(req, res, next) {
  try {
    const { id } = req.params;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const condition = isUuid ? 'id = $1' : 'slug = $1';

    const result = await db.query(`SELECT * FROM events WHERE ${condition} AND is_active = TRUE`, [id]);
    if (result.rowCount === 0) {
      return ApiResponse.error(res, 'Event not found', [], 404);
    }
    return ApiResponse.success(res, 'Event details retrieved', result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function registerForEvent(req, res, next) {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    // Check event exists
    const eventCheck = await db.query('SELECT id, max_participants FROM events WHERE id = $1 AND is_active = TRUE', [id]);
    if (eventCheck.rowCount === 0) {
      return ApiResponse.error(res, 'Event not found', [], 404);
    }

    const event = eventCheck.rows[0];
    if (event.max_participants) {
      const regCountRes = await db.query('SELECT COUNT(*) as count FROM event_registrations WHERE event_id = $1', [id]);
      if (parseInt(regCountRes.rows[0].count, 10) >= event.max_participants) {
        return ApiResponse.error(res, 'This event has reached maximum capacity.', [], 400);
      }
    }

    const insertRes = await db.query(`
      INSERT INTO event_registrations (event_id, name, email, phone)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [id, name.trim(), email.toLowerCase().trim(), phone || null]);

    return ApiResponse.created(res, 'Registration for event successful', insertRes.rows[0]);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listNews,
  getNewsArticle,
  listEvents,
  getEvent,
  registerForEvent
};
