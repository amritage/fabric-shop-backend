// routes/color.routes.js
const express = require('express');
const colorController = require('../controller/color.controller');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

// POST   /api/colors/add
router.post('/add', verifyToken, colorController.addColor);

// GET    /api/colors/view
router.get('/view', verifyToken, colorController.viewColors);

// GET    /api/colors/view/:id
router.get('/view/:id', verifyToken, colorController.viewColorById);

// PUT    /api/colors/update/:id
router.put('/update/:id', verifyToken, colorController.updateColor);

// DELETE /api/colors/delete/:id
router.delete('/delete/:id', verifyToken, colorController.deleteColor);

module.exports = router;
