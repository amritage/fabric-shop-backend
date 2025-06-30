// routes/finish.routes.js
const express = require('express');
const finishCtrl = require('../controller/finish.controller');
const router = express.Router();

router.post('/add', finishCtrl.addFinish);
router.get('/view', finishCtrl.viewFinishes);

// → new route to fetch one by ID
router.get('/view/:id', finishCtrl.getFinishById);

router.put('/update/:id', finishCtrl.updateFinish);
router.delete('/delete/:id', finishCtrl.deleteFinish);

module.exports = router;
