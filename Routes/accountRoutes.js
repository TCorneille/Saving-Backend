const express = require('express');
const accountController = require('../Controllers/accountController');
const authController = require('../Controllers/authController'); // for protect middleware

const router = express.Router();

// Protect all routes below (only logged-in users can access)
router.use(authController.protect);

// Dashboard: view user balance + transaction history
router.get('/dashboard', accountController.getDashboard);

// Deposit funds
router.post('/deposit', accountController.deposit);

// Withdraw funds
router.post('/withdraw', accountController.withdraw);

module.exports = router;
