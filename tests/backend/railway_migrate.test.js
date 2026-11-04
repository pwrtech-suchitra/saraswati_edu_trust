const test = require('node:test');
const assert = require('node:assert/strict');
const { configureMigrationEnvironment } = require('../../deploy/railway-migrate.cjs');

test('Railway migrations use and then remove the migration-only database URL', () => {
  const environment = {
    DATABASE_URL: 'postgresql://app:runtime@db.example.org/sect',
    MIGRATION_DATABASE_URL: 'postgresql://migrator:ddl@db.example.org/sect',
  };

  configureMigrationEnvironment(environment);

  assert.equal(environment.DATABASE_URL, 'postgresql://migrator:ddl@db.example.org/sect');
  assert.equal('MIGRATION_DATABASE_URL' in environment, false);
});

test('Railway migrations fail clearly when the migration database URL is absent', () => {
  assert.throws(
    () => configureMigrationEnvironment({ DATABASE_URL: 'postgresql://runtime@db/sect' }),
    {
      message: 'MIGRATION_DATABASE_URL is required to run Railway migrations',
    },
  );
});
