const express = require('express');
const vendorCtrl = require('../controller/vendor.controller');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

router.post('/add', verifyToken, vendorCtrl.addVendor);
router.get('/view', verifyToken, vendorCtrl.viewVendors);

// → new route to fetch one by ID
router.get('/view/:id', verifyToken, vendorCtrl.getVendorById);

router.put('/update/:id', verifyToken, vendorCtrl.updateVendor);
router.delete('/delete/:id', verifyToken, vendorCtrl.deleteVendor);

module.exports = router;
