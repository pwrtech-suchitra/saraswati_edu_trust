const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const db = require('../../backend/src/config/db');
const config = require('../../backend/src/config/env');
const mediaController = require('../../backend/src/controllers/mediaController');

function createMockRes() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    }
  };
}

test('listDocuments marks only existing document files as downloadable', async (t) => {
  const originalQuery = db.query;
  const originalUploadDir = config.uploadDir;
  const uploadDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sect-documents-'));
  fs.mkdirSync(path.join(uploadDir, 'documents'));
  fs.writeFileSync(path.join(uploadDir, 'documents', 'available.pdf'), 'test');
  config.uploadDir = uploadDir;
  db.query = async () => ({
    rows: [
      { id: 1, file_url: '/uploads/documents/available.pdf' },
      { id: 2, file_url: '/uploads/documents/missing.pdf' },
      { id: 3, file_url: '/uploads/documents/../missing.pdf' }
    ]
  });

  t.after(() => {
    db.query = originalQuery;
    config.uploadDir = originalUploadDir;
    fs.rmSync(uploadDir, { recursive: true, force: true });
  });

  const res = createMockRes();
  await mediaController.listDocuments({ query: {} }, res, (error) => {
    throw error;
  });

  assert.equal(res.body.success, true);
  assert.deepEqual(res.body.data.map((document) => document.file_available), [true, false, false]);
});
