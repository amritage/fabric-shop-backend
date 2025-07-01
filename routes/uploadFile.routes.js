const express = require('express');
const { fileUpload } = require('../controller/upload.controller');
const uploader = require('../middleware/uploader');

const router = express.Router();

// routes
router.post('/single', uploader.single('file'), fileUpload);

module.exports = router;
