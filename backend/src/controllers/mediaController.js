/**
 * Media & Documents Controller
 * Author: Suchitra (Backend & Database Developer)
 */

const db = require('../config/db');
const config = require('../config/env');
const fs = require('fs');
const path = require('path');
const ApiResponse = require('../utils/apiResponse');

function documentFileExists(fileUrl) {
  const prefix = '/uploads/documents/';
  if (typeof fileUrl !== 'string' || !fileUrl.startsWith(prefix)) {
    return false;
  }

  const filename = path.posix.basename(fileUrl);
  if (!filename || filename === '.' || filename === '..') {
    return false;
  }

  const filePath = path.resolve(config.uploadDir, 'documents', filename);
  return fs.existsSync(filePath);
}

async function listMedia(req, res, next) {
  try {
    const { category } = req.query;
    let sql = 'SELECT * FROM media_files';
    const params = [];

    if (category) {
      params.push(category);
      sql += ' WHERE category = $1';
    }
    sql += ' ORDER BY created_at DESC';

    const result = await db.query(sql, params);
    return ApiResponse.success(res, 'Media gallery retrieved', result.rows);
  } catch (err) {
    next(err);
  }
}

async function uploadMedia(req, res, next) {
  try {
    if (!req.file) {
      return ApiResponse.error(res, 'File is required', [{ message: 'No file uploaded' }], 400);
    }
    const { title, category, caption, media_type = 'IMAGE' } = req.body;
    const fileUrl = `/uploads/gallery/${req.file.filename}`;

    const text = `
      INSERT INTO media_files (title, media_type, file_url, category, caption)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await db.query(text, [title || req.file.originalname, media_type, fileUrl, category || null, caption || null]);
    return ApiResponse.created(res, 'Media uploaded successfully', result.rows[0]);
  } catch (err) {
    next(err);
  }
}

async function listDocuments(req, res, next) {
  try {
    const { doc_type, year } = req.query;
    const where = [];
    const params = [];

    if (doc_type) {
      params.push(doc_type);
      where.push(`doc_type = $${params.length}`);
    }
    if (year) {
      params.push(year);
      where.push(`year = $${params.length}`);
    }

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const sql = `SELECT * FROM documents ${whereSql} ORDER BY year DESC, created_at DESC`;

    const result = await db.query(sql, params);
    const documents = result.rows.map((document) => ({
      ...document,
      file_available: documentFileExists(document.file_url)
    }));
    return ApiResponse.success(res, 'Documents retrieved', documents);
  } catch (err) {
    next(err);
  }
}

async function uploadDocument(req, res, next) {
  try {
    if (!req.file) {
      return ApiResponse.error(res, 'PDF file is required', [{ message: 'No file uploaded' }], 400);
    }
    const { title, doc_type, year, description } = req.body;
    const fileUrl = `/uploads/documents/${req.file.filename}`;
    const fileSizeKb = Math.round(req.file.size / 1024);

    const text = `
      INSERT INTO documents (title, file_url, file_size_kb, doc_type, year, description)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await db.query(text, [title || req.file.originalname, fileUrl, fileSizeKb, doc_type || 'ANNUAL_REPORT', year || null, description || null]);
    return ApiResponse.created(res, 'Document uploaded successfully', result.rows[0]);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listMedia,
  uploadMedia,
  listDocuments,
  uploadDocument
};
