const express = require('express');
const router = express.Router();
const controller = require('../controller/groupcode.controller');
const verifyToken = require('../middleware/verifyToken');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }).fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 },
]);

// Middleware for error handling (like newproduct)
const handleMulterUpload = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError || err) {
      return res.status(400).json({ error: err.message });
    }
    next();
  });
};

router.post('/add', handleMulterUpload, controller.addGroupCode);
router.get('/view', controller.viewGroupCodes);
router.get('/view/:id', controller.getGroupCodeById);
router.put('/update/:id', handleMulterUpload, controller.updateGroupCode);
router.delete('/delete/:id', controller.deleteGroupCode);

module.exports = router;
