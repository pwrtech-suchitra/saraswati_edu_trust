const fs = require('node:fs');
const path = require('node:path');
const db = require('../backend/src/config/db');

async function seedRoles() {
  const seedPath = path.join(__dirname, '../database/seeds/001_roles_and_permissions_seed.sql');
  await db.exec(fs.readFileSync(seedPath, 'utf8'));
}

seedRoles()
  .then(() => console.log('Default roles and permissions are ready.'))
  .catch((error) => {
    console.error(`Role seed failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(() => db.pool.end());