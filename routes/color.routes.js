// routes/color.routes.js
const express = require('express');
const colorController = require('../controller/color.controller');

const router = express.Router();

// POST   /api/colors/add
router.post('/add', colorController.addColor);

// GET    /api/colors/view
router.get('/view', colorController.viewColors);

// GET    /api/colors/view/:id
router.get('/view/:id', colorController.viewColorById);

// PUT    /api/colors/update/:id
router.put('/update/:id', colorController.updateColor);

// DELETE /api/colors/delete/:id
router.delete('/delete/:id', colorController.deleteColor);

module.exports = router;
