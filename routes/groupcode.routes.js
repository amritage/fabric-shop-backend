const express = require('express');
const router = express.Router();
const controller = require('../controller/groupcode.controller');
const verifyToken = require('../middleware/verifyToken');

router.post('/add', verifyToken, controller.addGroupCode);
router.get('/view', verifyToken, controller.viewGroupCodes);
router.get('/view/:id', verifyToken, controller.getGroupCodeById);
router.put('/update/:id', verifyToken, controller.updateGroupCode);
router.delete('/delete/:id', verifyToken, controller.deleteGroupCode);

module.exports = router;
