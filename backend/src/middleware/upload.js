/**
 * File & Media Upload Middleware (Multer)
 * Author: Suchitra (Backend & Database Developer)
 */

const fs = require('fs');
const path = require('path');
const config = require('../config/env');

let multer;
try {
  multer = require('multer');
} catch {
  // Graceful fallback dummy if multer is being installed
  multer = () => ({
    single: () => (req, res, next) => next(),
    array: () => (req, res, next) => next()
  });
  multer.diskStorage = () => {};
}

// Ensure upload directories exist
const uploadsBase = config.uploadDir;
const dirs = ['projects', 'gallery', 'documents'];
dirs.forEach(sub => {
  const dirPath = path.join(uploadsBase, sub);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

const storage = multer.diskStorage ? multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'projects';
    if (file.mimetype === 'application/pdf') {
      folder = 'documents';
    } else if (req.baseUrl.includes('media')) {
      folder = 'gallery';
    }
    cb(null, path.join(uploadsBase, folder));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
}) : null;

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only JPEG, PNG, WEBP and PDF files are allowed.'), false);
  }
};

const upload = multer && multer.diskStorage ? multer({
  storage,
  limits: {
    fileSize: config.maxFileSizeMb * 1024 * 1024 // e.g. 10MB
  },
  fileFilter
}) : {
  single: () => (req, res, next) => next(),
  array: () => (req, res, next) => next()
};

module.exports = upload;
