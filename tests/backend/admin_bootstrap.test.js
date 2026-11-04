const test = require('node:test');
const assert = require('node:assert/strict');
const { createAdminUser } = require('../../backend/scripts/createAdmin');

function makeDatabase({ existingUser = false } = {}) {
  const calls = [];
  const client = {
    query: async (sql, params = []) => {
      calls.push({ sql, params });
      if (sql.includes('SELECT id FROM roles')) return { rowCount: 1, rows: [{ id: 7 }] };
      if (sql.includes('SELECT id FROM users')) {
        return { rowCount: existingUser ? 1 : 0, rows: existingUser ? [{ id: 'existing-id' }] : [] };
      }
      if (sql.includes('INSERT INTO users')) return { rowCount: 1, rows: [{ id: 'new-id' }] };
      return { rowCount: 1, rows: [] };
    },
    release: () => calls.push({ sql: 'RELEASE', params: [] })
  };

  return {
    calls,
    database: { getClient: async () => client }
  };
}

const validAdmin = {
  email: 'Admin@sect.org',
  password: 'StrongAdminPassword123!',
  fullName: 'SECT Administrator'
};

test('admin bootstrap creates a normalized account with a hashed password and ADMIN role', async () => {
  const { calls, database } = makeDatabase();
  const result = await createAdminUser({ ...validAdmin, database });

  assert.deepEqual(result, { id: 'new-id', email: 'admin@sect.org' });
  const insert = calls.find(({ sql }) => sql.includes('INSERT INTO users'));
  assert.equal(insert.params[1], 'admin@sect.org');
  assert.notEqual(insert.params[2], validAdmin.password);
  assert.match(insert.params[2], /^\$2[aby]\$/);
  assert.ok(calls.some(({ sql, params }) => sql.includes('INSERT INTO user_roles') && params[1] === 7));
  assert.ok(calls.some(({ sql }) => sql === 'COMMIT'));
  assert.ok(calls.some(({ sql }) => sql === 'RELEASE'));
});

test('admin bootstrap refuses existing accounts and rolls back', async () => {
  const { calls, database } = makeDatabase({ existingUser: true });

  await assert.rejects(
    createAdminUser({ ...validAdmin, database }),
    /refusing to change or elevate it/
  );
  assert.ok(calls.some(({ sql }) => sql === 'ROLLBACK'));
  assert.ok(!calls.some(({ sql }) => sql.includes('INSERT INTO users')));
});

test('admin bootstrap rejects weak passwords before opening a database connection', async () => {
  let connected = false;
  const database = {
    getClient: async () => {
      connected = true;
      throw new Error('Database should not be reached');
    }
  };

  await assert.rejects(
    createAdminUser({ ...validAdmin, password: 'WeakPass1!', database }),
    /at least 16 characters/
  );
  assert.equal(connected, false);
});
