const bcrypt = require('bcryptjs');
const db = require('../src/config/db');

const passwordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{16,}$/;

async function createAdminUser({ email, password, fullName = 'SECT Trust Administrator', database = db }) {
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new Error('BOOTSTRAP_ADMIN_EMAIL must be a valid email address.');
  }
  if (typeof password !== 'string' || !passwordPolicy.test(password)) {
    throw new Error('BOOTSTRAP_ADMIN_PASSWORD must be at least 16 characters and include lowercase, uppercase, numeric, and symbol characters.');
  }
  if (typeof fullName !== 'string' || fullName.trim().length < 2 || fullName.trim().length > 150) {
    throw new Error('BOOTSTRAP_ADMIN_NAME must be between 2 and 150 characters.');
  }

  const client = await database.getClient();
  try {
    await client.query('BEGIN');

    const roleResult = await client.query('SELECT id FROM roles WHERE name = $1', ['ADMIN']);
    if (roleResult.rowCount === 0) {
      throw new Error('ADMIN role is missing; apply the role seed before creating an administrator.');
    }

    const existingUser = await client.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
    if (existingUser.rowCount > 0) {
      throw new Error('An account with this email already exists; refusing to change or elevate it.');
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const userResult = await client.query(`
      INSERT INTO users (full_name, email, password_hash, is_active)
      VALUES ($1, $2, $3, TRUE)
      RETURNING id
    `, [fullName.trim(), normalizedEmail, passwordHash]);

    await client.query(
      'INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)',
      [userResult.rows[0].id, roleResult.rows[0].id]
    );
    await client.query('COMMIT');

    return { id: userResult.rows[0].id, email: normalizedEmail };
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}

async function run() {
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL;
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;
  const fullName = process.env.BOOTSTRAP_ADMIN_NAME || 'SECT Trust Administrator';
  delete process.env.BOOTSTRAP_ADMIN_PASSWORD;

  if (process.env.NODE_ENV !== 'production') {
    throw new Error('Administrator bootstrap is restricted to NODE_ENV=production.');
  }

  const admin = await createAdminUser({ email, password, fullName });
  console.log(`Administrator created: ${admin.email} (${admin.id}). Remove the bootstrap environment variables now.`);
}

if (require.main === module) {
  run()
    .catch((error) => {
      console.error(`[Admin Bootstrap] ${error.message}`);
      process.exitCode = 1;
    })
    .finally(() => db.pool.end());
}

module.exports = { createAdminUser };
