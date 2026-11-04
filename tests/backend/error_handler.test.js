const test = require('node:test');
const assert = require('node:assert/strict');

const errorHandler = require('../../backend/src/middleware/errorHandler');

function createResponse({ headersSent = false } = {}) {
  const response = {
    headersSent,
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    }
  };
  return response;
}

test('error handler returns a client error for malformed JSON', () => {
  const response = createResponse();
  errorHandler(
    { type: 'entity.parse.failed', message: 'Unexpected token' },
    { method: 'POST', originalUrl: '/api/v1/test' },
    response,
    assert.fail
  );

  assert.equal(response.statusCode, 400);
  assert.equal(response.body.message, 'Request body contains invalid JSON.');
});

test('error handler rejects oversized request bodies with 413', () => {
  const response = createResponse();
  errorHandler(
    { type: 'entity.too.large', message: 'Payload too large' },
    { method: 'POST', originalUrl: '/api/v1/test' },
    response,
    assert.fail
  );

  assert.equal(response.statusCode, 413);
  assert.equal(response.body.message, 'Request body is too large.');
});

test('error handler forwards errors when headers have already been sent', () => {
  const response = createResponse({ headersSent: true });
  const error = new Error('Stream failed');
  let forwarded;

  errorHandler(error, { method: 'GET', originalUrl: '/api/v1/test' }, response, (nextError) => {
    forwarded = nextError;
  });

  assert.equal(forwarded, error);
  assert.equal(response.body, null);
});

test('error handler does not use an invalid error status code', () => {
  const response = createResponse();
  errorHandler(
    { statusCode: 700, message: 'Invalid status' },
    { method: 'GET', originalUrl: '/api/v1/test' },
    response,
    assert.fail
  );

  assert.equal(response.statusCode, 500);
  assert.equal(response.body.success, false);
});
