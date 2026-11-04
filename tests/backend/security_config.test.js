const test = require('node:test');
const assert = require('node:assert/strict');
const config = require('../../backend/src/config/env');

const securityModulePath = require.resolve('../../backend/src/middleware/security');

function createCorsMiddleware() {
  delete require.cache[securityModulePath];
  const configureSecurity = require(securityModulePath);
  const middleware = [];
  configureSecurity({ use: (handler) => middleware.push(handler) });
  return middleware[1];
}

function requestOrigin(corsMiddleware, origin) {
  const headers = {};
  return new Promise((resolve) => {
    corsMiddleware(
      { method: 'GET', headers: { origin } },
      {
        getHeader: (name) => headers[name],
        setHeader: (name, value) => { headers[name] = value; }
      },
      (error) => resolve({ error, headers })
    );
  });
}

test('production CORS allows only the configured frontend origin', async (t) => {
  const originalNodeEnv = config.nodeEnv;
  const originalFrontendUrl = config.frontendUrl;
  t.after(() => {
    config.nodeEnv = originalNodeEnv;
    config.frontendUrl = originalFrontendUrl;
    delete require.cache[securityModulePath];
  });

  config.nodeEnv = 'production';
  config.frontendUrl = 'https://sect.example.test';
  const corsMiddleware = createCorsMiddleware();

  const allowed = await requestOrigin(corsMiddleware, 'https://sect.example.test');
  assert.ifError(allowed.error);
  assert.strictEqual(allowed.headers['Access-Control-Allow-Origin'], 'https://sect.example.test');

  const localhost = await requestOrigin(corsMiddleware, 'http://localhost:3000');
  assert.match(localhost.error.message, /CORS policy does not allow access/);
  assert.strictEqual(localhost.headers['Access-Control-Allow-Origin'], undefined);
});

test('development CORS continues to allow local frontend origins', async (t) => {
  const originalNodeEnv = config.nodeEnv;
  const originalFrontendUrl = config.frontendUrl;
  t.after(() => {
    config.nodeEnv = originalNodeEnv;
    config.frontendUrl = originalFrontendUrl;
    delete require.cache[securityModulePath];
  });

  config.nodeEnv = 'development';
  config.frontendUrl = 'http://localhost:5173';
  const corsMiddleware = createCorsMiddleware();

  const result = await requestOrigin(corsMiddleware, 'http://localhost:3000');
  assert.ifError(result.error);
  assert.strictEqual(result.headers['Access-Control-Allow-Origin'], 'http://localhost:3000');
});
