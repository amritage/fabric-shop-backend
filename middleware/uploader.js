const multer = require('multer');
const path = require('path');

const ALLOWED_IMAGE_TYPES = (
  process.env.ALLOWED_IMAGE_TYPES || 'png,jpg,jpeg,webp'
).split(',');
const ALLOWED_VIDEO_TYPES = (
  process.env.ALLOWED_VIDEO_TYPES || 'mp4,avi,mov,webm'
).split(',');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images');
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
        new Error(
          `Must be one of: ${ALLOWED_IMAGE_TYPES.concat(ALLOWED_VIDEO_TYPES).join(', ')}`,
        ),
      );
    }
  },
  limits: {
    fileSize: 4000000,
  },
});

module.exports = uploader;
