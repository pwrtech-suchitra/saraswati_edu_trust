/**
 * Environment Variable Loader & Configuration
 * Author: Suchitra (Backend & Database Developer)
 */

const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/sect_db',
  
  jwt: {
    secret: process.env.JWT_SECRET || 'sect_default_dev_secret_key_1234567890',
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'sect_default_refresh_secret_987654321',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },

  payment: {
    keyId: process.env.PAYMENT_KEY_ID || 'rzp_test_demo',
    keySecret: process.env.PAYMENT_KEY_SECRET || 'secret_demo',
    webhookSecret: process.env.PAYMENT_WEBHOOK_SECRET || 'whsec_demo'
  },

  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  uploadDir: process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads'),
  maxFileSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10),

  trust: {
    name: process.env.TRUST_NAME || 'Saraswati Educational & Charitable Trust',
    shortName: 'SECT',
    pan: process.env.TRUST_PAN || 'ABBTS7158P',
    registrationNo: process.env.TRUST_REG_NO || 'TRUST/OD/2018/0091',
    exemption80GNo: process.env.TRUST_80G_NO || 'AAETS9821BF20214',
    address: 'K-8-82, Kalinga Nagar, Ghatikia, Bhubaneswar, Odisha-751029',
    phone: '0674-2954256',
    mobiles: ['9937159760', '9438747172'],
    email: 'strust12@gmail.com'
  }
};

module.exports = config;
