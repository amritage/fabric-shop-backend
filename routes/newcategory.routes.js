require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const newCatCtrl = require('../controller/newcategory.controller');

const router = express.Router();

// Read from .env
const imageUploadPath = process.env.UPLOAD_IMAGE_PATH || './uploadimage';
const allowedImageMimeTypes = (process.env.ALLOWED_IMAGE_TYPES || '')
  .split(',')
  .map((type) => type.trim());

// Multer storage config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, imageUploadPath);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}_${Date.now()}${ext}`);
  },
});

// File filter for allowed image types
const fileFilter = (req, file, cb) => {
  if (allowedImageMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Only allowed image types are: ${allowedImageMimeTypes.join(', ')}`,
      ),
      false,
    );
  }
};

// Multer setup
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
}).fields([{ name: 'image', maxCount: 1 }]);

const handleMulterUpload = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError || err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

router.post('/addcategory', handleMulterUpload, newCatCtrl.addCategory);
router.put(
  '/update/:categoryid',
  handleMulterUpload,
  newCatCtrl.updateCategory,
);
router.get('/viewcategory', newCatCtrl.viewCategories);
router.get('/viewcategory/:categoryid', newCatCtrl.getCategoryById);
router.delete('/deletecategory/:categoryid', newCatCtrl.deleteCategory);

module.exports = router;
