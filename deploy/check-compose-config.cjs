const { spawnSync } = require('node:child_process');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const envFile = path.join(__dirname, 'production.env.example');
const composeFile = path.join(__dirname, 'compose.production.yaml');
const result = spawnSync(
  'docker',
  ['compose', '--env-file', envFile, '-f', composeFile, '--profile', 'ops', 'config', '--format', 'json'],
  { cwd: root, encoding: 'utf8' }
);

if (result.error) {
  console.error('Could not run Docker Compose configuration validation:', result.error.message);
  process.exitCode = 1;
} else if (result.status !== 0) {
  console.error(result.stderr || 'Docker Compose configuration validation failed.');
  process.exitCode = result.status || 1;
} else {
  try {
    const compose = JSON.parse(result.stdout);
    const apiEnvironment = compose.services?.api?.environment;
    const migrationEnvironment = compose.services?.migrate?.environment;
    const apiUrl = new URL(apiEnvironment?.DATABASE_URL);
    const migrationUrl = new URL(migrationEnvironment?.DATABASE_URL);

    if (apiUrl.username !== 'sect_app') {
      throw new Error('The long-running API must use the sect_app database role.');
    }
    if (migrationUrl.username !== 'sect_migrator') {
      throw new Error('The migration job must use the sect_migrator database role.');
    }
    if (apiEnvironment.MIGRATION_DATABASE_URL !== undefined) {
      throw new Error('The long-running API must not receive the migration database URL.');
    }
    if (apiEnvironment.TRUST_PROXY_HOPS !== '2') {
      throw new Error('The production API must trust exactly the Caddy and Nginx proxy hops.');
    }

    console.log('Production Compose configuration uses distinct least-privilege app and migration roles.');
  } catch (error) {
    console.error(`Production Compose configuration check failed: ${error.message}`);
    process.exitCode = 1;
  }
}
