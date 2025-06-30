const express = require('express');
const vendorCtrl = require('../controller/vendor.controller');
const router = express.Router();

router.post('/add', vendorCtrl.addVendor);
router.get('/view', vendorCtrl.viewVendors);

// → new route to fetch one by ID
router.get('/view/:id', vendorCtrl.getVendorById);

router.put('/update/:id', vendorCtrl.updateVendor);
router.delete('/delete/:id', vendorCtrl.deleteVendor);

module.exports = router;
