function configureMigrationEnvironment(environment) {
  if (!environment.MIGRATION_DATABASE_URL) {
    throw new Error('MIGRATION_DATABASE_URL is required to run Railway migrations');
  }

  environment.DATABASE_URL = environment.MIGRATION_DATABASE_URL;
  delete environment.MIGRATION_DATABASE_URL;
}

if (require.main === module) {
  try {
    configureMigrationEnvironment(process.env);
  } catch (error) {
    console.error(`[Railway migration] ${error.message}`);
    process.exitCode = 1;
  }

  if (!process.exitCode) {
    require('../database/migrate').runMigrations();
  }
}

module.exports = { configureMigrationEnvironment };
