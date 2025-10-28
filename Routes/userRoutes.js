const express = require('express');
const authController = require('../Controllers/authController');
const userController = require('../Controllers/userController'); // optional if you later add profile update, etc.

const router = express.Router();


//  * PUBLIC AUTH ROUTES

// User signup (register)
router.post('/signup', authController.signup);

// User login
router.post('/login', authController.login);

//  Forgot / Reset Password
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);


//  * PROTECTED ROUTES (require login)
 
router.use(authController.protect);

// Update password (logged-in users)
router.patch('/updateMyPassword', authController.updatePassword);

//  Add more user-related routes like viewing or updating profile info
router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);


//  * ADMIN-ONLY ROUTES
router.use(authController.restrictTo('admin'));

// Only admins can access all users (for management)
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
