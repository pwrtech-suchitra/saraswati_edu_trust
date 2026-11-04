/**
 * Environment Variable Loader & Configuration
 * Author: Suchitra (Backend & Database Developer)
 */

const dotenv = require('dotenv');
const path = require('path');
const crypto = require('crypto');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';
const trustProxyHops = process.env.TRUST_PROXY_HOPS === undefined
  ? 0
  : Number(process.env.TRUST_PROXY_HOPS);
const developmentJwtSecret = crypto.randomBytes(32).toString('hex');
const developmentRefreshSecret = crypto.randomBytes(32).toString('hex');

function assertProductionConfiguration() {
  const errors = [];
  const rejectPlaceholder = (name, value, minLength) => {
    if (!value || value.length < minLength || /change.?me|placeholder|your_|demo|example/i.test(value)) {
      errors.push(`${name} must be a non-placeholder value of at least ${minLength} characters`);
    }
  };

  if (!['development', 'test', 'production'].includes(nodeEnv)) {
    errors.push('NODE_ENV must be development, test, or production');
  }

  if (
    process.env.TRUST_PROXY_HOPS !== undefined &&
    (
      !/^\d+$/.test(process.env.TRUST_PROXY_HOPS) ||
      trustProxyHops > 5 ||
      (isProduction && trustProxyHops < 1)
    )
  ) {
    errors.push(isProduction
      ? 'TRUST_PROXY_HOPS must be an integer between 1 and 5 in production'
      : 'TRUST_PROXY_HOPS must be an integer between 0 and 5');
  }

  if (!isProduction) {
    if (errors.length > 0) {
      throw new Error(`Invalid configuration:\n- ${errors.join('\n- ')}`);
    }
    return;
  }

  rejectPlaceholder('JWT_SECRET', process.env.JWT_SECRET, 32);
  rejectPlaceholder('JWT_REFRESH_SECRET', process.env.JWT_REFRESH_SECRET, 32);
  if (process.env.JWT_SECRET && process.env.JWT_SECRET === process.env.JWT_REFRESH_SECRET) {
    errors.push('JWT_SECRET and JWT_REFRESH_SECRET must be different values');
  }

  if (!process.env.DATABASE_URL) {
    errors.push('DATABASE_URL is required in production');
  } else {
    try {
      const databaseUrl = new URL(process.env.DATABASE_URL);
      if (!['postgres:', 'postgresql:'].includes(databaseUrl.protocol)) {
        errors.push('DATABASE_URL must use the PostgreSQL protocol');
      }
    } catch {
      errors.push('DATABASE_URL must be a valid PostgreSQL connection URL');
    }
  }

  if (process.env.USE_EMBEDDED_DB === 'true') {
    errors.push('USE_EMBEDDED_DB cannot be enabled in production');
  }

  if (!process.env.FRONTEND_URL) {
    errors.push('FRONTEND_URL is required in production');
  } else {
    try {
      const frontendUrl = new URL(process.env.FRONTEND_URL);
      if (frontendUrl.protocol !== 'https:') {
        errors.push('FRONTEND_URL must use HTTPS in production');
      }
    } catch {
      errors.push('FRONTEND_URL must be a valid URL');
    }
  }

  if (errors.length > 0) {
    throw new Error(`Invalid production configuration:\n- ${errors.join('\n- ')}`);
  }
}

assertProductionConfiguration();

const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv,
  trustProxyHops,
  databaseSslCa: process.env.DATABASE_SSL_CA || null,
  databaseUrl: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/sect_db',
  
  jwt: {
    secret: process.env.JWT_SECRET || developmentJwtSecret,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    refreshSecret: process.env.JWT_REFRESH_SECRET || developmentRefreshSecret,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },

  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  uploadDir: process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads'),
  maxFileSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10),

};

module.exports = config;
