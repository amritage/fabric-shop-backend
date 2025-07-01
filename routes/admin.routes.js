const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const authorize = require('../middleware/authorization');
const {
  registerAdmin,
  loginAdmin,
  updateStaff,
  changePassword,
  addStaff,
  getAllStaff,
  deleteStaff,
  getStaffById,
  forgetPassword,
  confirmAdminForgetPass,
} = require('../controller/admin.controller');

//register a staff
router.post('/register', registerAdmin);

//login a admin
router.post('/login', loginAdmin);

// All routes below require authentication and admin role
router.patch(
  '/change-password',
  verifyToken,
  authorize('Admin'),
  changePassword,
);
router.post('/add', verifyToken, authorize('Admin'), addStaff);
router.get('/all', verifyToken, authorize('Admin'), getAllStaff);
router.patch('/forget-password', forgetPassword);
router.patch('/confirm-forget-password', confirmAdminForgetPass);
router.get('/get/:id', verifyToken, authorize('Admin'), getStaffById);
router.patch('/update-staff/:id', verifyToken, authorize('Admin'), updateStaff);
// router.put("/update-status/:id", verifyToken, authorize('Admin'), updatedStatus);
router.delete('/:id', verifyToken, authorize('Admin'), deleteStaff);

module.exports = router;
