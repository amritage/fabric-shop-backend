// routes/substructure.routes.js
const express = require('express');
const substructureCtrl = require('../controller/substructure.controller');
const router = express.Router();

router.post('/add', substructureCtrl.addSubstructure);
router.get('/view', substructureCtrl.viewSubstructures);

// → new route to fetch one by ID
router.get('/view/:id', substructureCtrl.getSubstructureById);

router.put('/update/:id', substructureCtrl.updateSubstructure);
router.delete('/delete/:id', substructureCtrl.deleteSubstructure);

module.exports = router;
