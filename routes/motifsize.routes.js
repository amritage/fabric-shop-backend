// routes/motifsize.routes.js
const express = require('express');
const motifsizeCtrl = require('../controller/motifsize.controller');
const router = express.Router();

router.post('/add', motifsizeCtrl.addMotifsize);
router.get('/view', motifsizeCtrl.viewMotifsizes);

// → new route to fetch one by ID
router.get('/view/:id', motifsizeCtrl.getMotifsizeById);

router.put('/update/:id', motifsizeCtrl.updateMotifsize);
router.delete('/delete/:id', motifsizeCtrl.deleteMotifsize);

module.exports = router;
