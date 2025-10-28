const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

// ------------------- PUBLIC ROUTES -------------------
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

// ------------------- PROTECTED ROUTES -------------------
// Apply auth protection to all routes below
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);

router.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);

router.delete('/deleteMe', userController.deleteMe);

// ------------------- ADMIN-ONLY ROUTES -------------------
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAll)
  .post(userController.createOne); // optional, can disable if admin should not create users manually

router
  .route('/:id')
  .get(userController.getOne)
  .patch(userController.updateOne)
  .delete(userController.deleteOne);

module.exports = router;
