require('dotenv').config();
const express = require('express');
const multer = require('multer');
const newCatCtrl = require('../controller/newcategory.controller');

const router = express.Router();

// Use memory storage for multer
const upload = multer({ storage: multer.memoryStorage() }).fields([
  { name: 'image', maxCount: 1 },
]);

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
