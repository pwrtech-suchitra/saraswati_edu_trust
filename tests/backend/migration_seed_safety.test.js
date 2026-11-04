const test = require('node:test');
const assert = require('node:assert/strict');
const { shouldSkipSeed } = require('../../database/migrate');

test('destructive fixture seeds skip tables that already contain data', async () => {
  const queries = [];
  const client = {
    async query(sql) {
      queries.push(sql);
      return { rows: [{ has_data: sql.includes('FROM project_images') }] };
    }
  };

  assert.equal(await shouldSkipSeed('004_projects_seed.sql', client), true);
  assert.equal(queries.length, 2);
});

test('destructive fixture seeds run when all target tables are empty', async () => {
  const queries = [];
  const client = {
    async query(sql) {
      queries.push(sql);
      return { rows: [{ has_data: false }] };
    }
  };

  assert.equal(await shouldSkipSeed('005_news_and_events_seed.sql', client), false);
  assert.equal(queries.length, 3);
});

test('non-destructive seeds are not blocked by the data safety guard', async () => {
  const client = {
    async query() {
      assert.fail('Unexpected database query for unguarded seed');
    }
  };

  assert.equal(await shouldSkipSeed('001_roles_and_permissions_seed.sql', client), false);
});
