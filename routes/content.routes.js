// routes/contentapi.js
const express = require('express');
const contentController = require('../controller/content.controller');
const router = express.Router();

// POST   /api/addcontent
router.post('/addcontent', contentController.addContent);

// GET    /api/viewcontent
router.get('/viewcontent', contentController.viewContents);

// GET    /api/viewcontent/:id
router.get('/viewcontent/:id', contentController.viewContentById);

// PUT    /api/updatecontent/:id
router.put('/updatecontent/:id', contentController.updateContent);

// DELETE /api/deletecontent/:id
router.delete('/deletecontent/:id', contentController.deleteContent);

module.exports = router;
