// routes/subfinish.routes.js
const express = require('express');
const subfinishCtrl = require('../controller/subfinish.controller');
const router = express.Router();

router.post('/add', subfinishCtrl.addSubfinish);
router.get('/view', subfinishCtrl.viewSubfinishes);

// → new route to fetch one by ID
router.get('/view/:id', subfinishCtrl.getSubfinishById);

router.put('/update/:id', subfinishCtrl.updateSubfinish);
router.delete('/delete/:id', subfinishCtrl.deleteSubfinish);

module.exports = router;
