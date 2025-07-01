const express = require('express');
const suitableforCtrl = require('../controller/suitablefor.controller');
const router = express.Router();

router.post('/add', suitableforCtrl.addSuitablefor);
router.get('/view', suitableforCtrl.viewSuitablefors);

// → new route to fetch one by ID
router.get('/view/:id', suitableforCtrl.getSuitableforById);

router.put('/update/:id', suitableforCtrl.updateSuitablefor);
router.delete('/delete/:id', suitableforCtrl.deleteSuitablefor);

module.exports = router;
