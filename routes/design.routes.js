// routes/design.routes.js

const express = require('express');
const designCtrl = require('../controller/design.controller');
const router = express.Router();

// existing routes…
router.post('/add', designCtrl.addDesign);
router.get('/view', designCtrl.viewDesigns);
// → new route to fetch one by ID
router.get('/view/:id', designCtrl.getDesignById);

router.put('/update/:id', designCtrl.updateDesign);
router.delete('/delete/:id', designCtrl.deleteDesign);

module.exports = router;
