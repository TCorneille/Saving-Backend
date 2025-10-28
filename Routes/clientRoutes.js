const express = require('express');
const clientController = require('../Controllers/clientController');
const authController = require('../Controllers/authController');

const router = express.Router();

// Protect all routes for logged-in users only
router.use(authController.protect, authController.restrictTo('client'));

router.get('/dashboard', clientController.getDashboard);
router.post('/deposit', clientController.deposit);
router.post('/withdraw', clientController.withdraw);

module.exports = router;
