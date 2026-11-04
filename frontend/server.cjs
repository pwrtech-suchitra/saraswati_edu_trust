const fs = require('node:fs');
const http = require('node:http');
const https = require('node:https');
const path = require('node:path');
const { pipeline } = require('node:stream/promises');

const root = path.resolve(__dirname, 'dist');
let apiProxyTarget = null;
let startupError = null;
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
};

if (process.env.API_PROXY_TARGET) {
  try {
    apiProxyTarget = new URL(process.env.API_PROXY_TARGET);
    if (!['http:', 'https:'].includes(apiProxyTarget.protocol)) {
      throw new Error('API_PROXY_TARGET must use HTTP or HTTPS');
    }
    if (
      apiProxyTarget.username ||
      apiProxyTarget.password ||
      apiProxyTarget.search ||
      apiProxyTarget.hash ||
      apiProxyTarget.pathname !== '/'
    ) {
      throw new Error('API_PROXY_TARGET must be an origin without credentials, path, query, or fragment');
    }
  } catch (error) {
    startupError = error;
    console.error(`Invalid API_PROXY_TARGET: ${error.message}`);
  }
}

function getFilePath(requestUrl) {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(requestUrl, 'http://localhost').pathname);
  } catch {
    return null;
  }

  if (pathname.includes('\0') || pathname.includes('\\')) return null;

  const filePath = path.resolve(root, `.${pathname}`);
  return filePath === root || filePath.startsWith(`${root}${path.sep}`)
    ? { filePath, pathname }
    : null;
}

async function statOrNull(filePath) {
  try {
    return await fs.promises.stat(filePath);
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'ENOTDIR') return null;
    throw error;
  }
}

async function handleRequest(request, response) {
  const requestUrl = new URL(request.url, 'http://localhost');
  if (
    apiProxyTarget &&
    (
      requestUrl.pathname === '/api' ||
      requestUrl.pathname.startsWith('/api/') ||
      requestUrl.pathname === '/uploads' ||
      requestUrl.pathname.startsWith('/uploads/')
    )
  ) {
    await proxyRequest(request, response, requestUrl);
    return;
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }

  const resolved = getFilePath(request.url);
  if (!resolved) {
    response.writeHead(400).end('Invalid request path');
    return;
  }

  let filePath = resolved.filePath;
  let file = await statOrNull(filePath);
  if (!file) {
    if (path.extname(resolved.pathname)) {
      response.writeHead(404).end('Not found');
      return;
    }
    filePath = path.join(root, 'index.html');
    file = await statOrNull(filePath);
    if (!file) {
      response.writeHead(503).end('Frontend build is unavailable');
      return;
    }
  }

  if (file.isDirectory()) {
    filePath = path.join(filePath, 'index.html');
    file = await statOrNull(filePath);
    if (!file) {
      response.writeHead(404).end('Not found');
      return;
    }
  }

  if (!file.isFile()) {
    response.writeHead(404).end('Not found');
    return;
  }

  const isHtml = path.basename(filePath) === 'index.html';
  response.writeHead(200, {
    'Content-Length': file.size,
    'Content-Type': mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
    'Cache-Control': isHtml ? 'no-cache' : 'public, max-age=3600',
    'X-Content-Type-Options': 'nosniff',
  });

  if (request.method === 'HEAD') {
    response.end();
    return;
  }

  await pipeline(fs.createReadStream(filePath), response);
}

function proxyRequest(request, response, requestUrl) {
  const transport = apiProxyTarget.protocol === 'https:' ? https : http;
  const upstreamRequest = transport.request(
    new URL(`${requestUrl.pathname}${requestUrl.search}`, apiProxyTarget),
    {
      method: request.method,
      headers: {
        ...request.headers,
        host: apiProxyTarget.host,
        'x-forwarded-host': request.headers['x-forwarded-host'] || request.headers.host,
        'x-forwarded-proto': request.headers['x-forwarded-proto'] || 'http',
      },
    },
    (upstreamResponse) => {
      response.writeHead(upstreamResponse.statusCode || 502, upstreamResponse.headers);
      upstreamResponse.on('error', (error) => {
        console.error('API proxy response failed:', error);
        response.destroy();
      });
      upstreamResponse.pipe(response);
    },
  );

  upstreamRequest.setTimeout(30000, () => {
    upstreamRequest.destroy(new Error('API proxy request timed out'));
  });
  upstreamRequest.on('error', (error) => {
    console.error('API proxy request failed:', error);
    if (response.headersSent || response.destroyed) {
      response.destroy();
      return;
    }
    response.writeHead(502, {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    }).end(JSON.stringify({
      success: false,
      message: 'API service unavailable',
    }));
  });

  request.pipe(upstreamRequest);
}

const server = http.createServer((request, response) => {
  handleRequest(request, response).catch((error) => {
    console.error('Frontend request failed:', error);
    if (response.headersSent || response.destroyed) {
      response.destroy();
      return;
    }
    response.writeHead(500, {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    }).end('Internal server error');
  });
});

const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || '127.0.0.1';

if (startupError) {
  process.exitCode = 1;
} else if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error(`Invalid frontend server port: ${process.env.PORT}`);
  process.exitCode = 1;
} else {
  server.listen(port, host, () => {
    console.log(`Frontend listening on http://${host}:${port}`);
  });

  server.on('error', (error) => {
    console.error('Frontend server failed to start:', error);
    process.exitCode = 1;
  });
}
