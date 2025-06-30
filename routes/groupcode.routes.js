const express = require('express');
const router = express.Router();
const controller = require('../controller/groupcode.controller');

router.post('/add', controller.addGroupCode);
router.get('/view', controller.viewGroupCodes);
router.get('/view/:id', controller.getGroupCodeById);
router.put('/update/:id', controller.updateGroupCode);
router.delete('/delete/:id', controller.deleteGroupCode);

module.exports = router;
