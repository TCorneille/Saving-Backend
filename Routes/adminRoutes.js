const express = require('express');
const adminController = require('../Controllers/adminController');
const authController = require('../Controllers/authController');

const router = express.Router();

// Protect all routes and restrict to admin
router.use(authController.protect, authController.restrictTo('admin'));

router.get('/customers', adminController.getAllCustomers);
router.get('/balances', adminController.getAllBalances);
router.post('/verify-device', adminController.verifyDeviceId);
router.get('/stats', adminController.getDashboardStats);

module.exports = router;
