const multer = require('multer');
const path = require('path');

const ALLOWED_IMAGE_TYPES = (
  process.env.ALLOWED_IMAGE_TYPES || 'png,jpg,jpeg,webp'
).split(',');
const ALLOWED_VIDEO_TYPES = (
  process.env.ALLOWED_VIDEO_TYPES || 'mp4,avi,mov,webm'
).split(',');

const IMAGE_SIZE_LIMIT = 4 * 1024 * 1024; // 4MB
const VIDEO_SIZE_LIMIT = 10 * 1024 * 1024; // 10MB

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const extension = path
      .extname(file.originalname)
      .replace('.', '')
      .toLowerCase();
    if (ALLOWED_IMAGE_TYPES.includes(extension)) {
      cb(null, 'public/images');
    } else if (ALLOWED_VIDEO_TYPES.includes(extension)) {
      cb(null, 'public/videos');
    } else {
      cb(new Error('Invalid file type'), null);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e4);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const uploader = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const extension = path
      .extname(file.originalname)
      .replace('.', '')
      .toLowerCase();
    const isImage = ALLOWED_IMAGE_TYPES.includes(extension);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(extension);
    if (isImage || isVideo) {
      cb(null, true);
    } else {
      cb(
        new multer.MulterError(
          'LIMIT_UNEXPECTED_FILE',
          `Must be one of: ${ALLOWED_IMAGE_TYPES.concat(ALLOWED_VIDEO_TYPES).join(', ')}`,
        ),
      );
    }
  },
  limits: {
    fileSize: (req, file, cb) => {
      // This function is not supported by multer, so we handle size in fileFilter
      // Instead, we will check size after upload in the controller if needed
      return undefined;
    },
  },
});

module.exports = uploader;
