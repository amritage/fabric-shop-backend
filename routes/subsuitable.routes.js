const express = require('express');
const subsuitableCtrl = require('../controller/subsuitable.controller');
const router = express.Router();

router.post('/add', subsuitableCtrl.addSubSuitable);
router.get('/view', subsuitableCtrl.viewSubSuitables);

// → new route to fetch one by ID
router.get('/view/:id', subsuitableCtrl.getSubSuitableById);

router.put('/update/:id', subsuitableCtrl.updateSubSuitable);
router.delete('/delete/:id', subsuitableCtrl.deleteSubSuitable);

module.exports = router;
