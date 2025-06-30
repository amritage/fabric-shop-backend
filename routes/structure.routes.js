// routes/structure.routes.js
const express = require('express');
const structCtrl = require('../controller/structure.controller');
const router = express.Router();

router.post('/add', structCtrl.addStructure);
router.get('/view', structCtrl.viewStructures);

// → new route to fetch one by ID
router.get('/view/:id', structCtrl.getStructureById);

router.put('/update/:id', structCtrl.updateStructure);
router.delete('/delete/:id', structCtrl.deleteStructure);

module.exports = router;
