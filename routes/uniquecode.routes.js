const express = require('express');
const uniquecodeCtrl = require('../controller/uniquecode.controller');
const router = express.Router();

router.post('/add', uniquecodeCtrl.addUniqueCode);
router.get('/view', uniquecodeCtrl.viewUniqueCodes);

// → new route to fetch one by ID
router.get('/view/:id', uniquecodeCtrl.getUniqueCodeById);

router.put('/update/:id', uniquecodeCtrl.updateUniqueCode);
router.delete('/delete/:id', uniquecodeCtrl.deleteUniqueCode);

module.exports = router;
