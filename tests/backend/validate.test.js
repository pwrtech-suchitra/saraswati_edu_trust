const test = require('node:test');
const assert = require('node:assert/strict');
const { createRequire } = require('node:module');
const backendRequire = createRequire(require.resolve('../../backend/package.json'));
const { z } = backendRequire('zod');
const validate = require('../../backend/src/middleware/validate');

test('Zod validation errors include field-level issue details', () => {
  const req = { body: { email: 'not-an-email' } };
  let response;
  let nextCalled = false;
  const res = {
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      response = payload;
      return this;
    }
  };

  validate(z.object({ email: z.string().email() }))(req, res, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 422);
  assert.equal(response.success, false);
  assert.ok(response.errors.some((issue) => issue.field === 'email'));
});
