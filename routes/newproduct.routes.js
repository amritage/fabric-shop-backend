require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const newProductController = require('../controller/newproduct.controller');

const router = express.Router();

// ⬇️ Read from .env
const imageUploadPath = process.env.UPLOAD_IMAGE_PATH || './uploadimage';
const videoUploadPath = process.env.UPLOAD_VIDEO_PATH || './uploadvideo';

const allowedImageMimeTypes = (process.env.ALLOWED_IMAGE_TYPES || '')
  .split(',')
  .map((type) => type.trim());

const allowedVideoMimeTypes = (process.env.ALLOWED_VIDEO_TYPES || '')
  .split(',')
  .map((type) => type.trim());

// ⬇️ Multer Storage Setup
const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (file.fieldname === 'video') {
      cb(null, videoUploadPath);
    } else {
      cb(null, imageUploadPath);
    }
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}_${Date.now()}${ext}`);
  },
});

// ⬇️ MIME Type Filter
const fileFilter = (req, file, cb) => {
  if (file.fieldname.startsWith('image')) {
    if (allowedImageMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid image format. Allowed: ${allowedImageMimeTypes.join(', ')}`,
        ),
        false,
      );
    }
  } else if (file.fieldname === 'video') {
    if (allowedVideoMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid video format. Allowed: ${allowedVideoMimeTypes.join(', ')}`,
        ),
        false,
      );
    }
  } else {
    cb(null, true); // For non-media fields
  }
};

// ⬇️ Multer Instance
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
}).fields([
  { name: 'image', maxCount: 1 },
  { name: 'image1', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'video', maxCount: 1 },
]);

// ⬇️ Middleware Wrapper for Error Handling
const handleMulterUpload = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError || err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

// ✅ ROUTES

router.post('/add', handleMulterUpload, newProductController.addProduct);
router.put(
  '/update/:id',
  handleMulterUpload,
  newProductController.updateProduct,
);

router.get('/view', newProductController.viewProducts);
router.get('/view/:id', newProductController.getProductById);
router.delete('/delete/:id', newProductController.deleteProduct);
router.get('/search/:q', newProductController.searchProducts);

router.get(
  '/groupcode/:groupcodeId',
  newProductController.getProductsByGroupCode,
);
router.get('/category/:id', newProductController.getProductsByCategoryId);
router.get('/structure/:id', newProductController.getProductsByStructureId);
router.get('/content/:id', newProductController.getProductsByContentId);
router.get('/finish/:id', newProductController.getProductsByFinishId);
router.get('/design/:id', newProductController.getProductsByDesignId);
router.get('/color/:id', newProductController.getProductsByColorId);
router.get('/motif/:id', newProductController.getProductsByMotifSizeId);
router.get('/suitable/:id', newProductController.getProductsBySuitableForId);
router.get('/vendor/:id', newProductController.getProductsByVendorId);
router.get(
  '/identifier/:identifier',
  newProductController.getProductByProductIdentifier,
);

router.get('/gsm/upto/:value', newProductController.getProductsByGsmValue);
router.get('/oz/upto/:value', newProductController.getProductsByOzValue);
router.get('/inch/upto/:value', newProductController.getProductsByInchValue);
router.get('/cm/upto/:value', newProductController.getProductsByCmValue);
router.get('/price/upto/:value', newProductController.getProductsByPriceValue);
router.get(
  '/quantity/upto/:value',
  newProductController.getProductsByQuantityValue,
);
router.get(
  '/purchaseprice/upto/:value',
  newProductController.getProductsByPurchasePriceValue,
);

// 🔥 Special tags: Popular / Offers / Top Rated
router.get('/popular', newProductController.getPopularProducts);
router.get('/offers', newProductController.getProductOffers);
router.get('/toprated', newProductController.getTopRatedProducts);

module.exports = router;
