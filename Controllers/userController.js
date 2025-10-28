const User = require('../Models/userModel');
const factory = require('./handlerFactory');
const sharp = require('sharp');
const multer = require('multer');
const catchAsync = require('../Utils/catchAsync');

// ------------------- MULTER CONFIG -------------------

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) cb(null, true);
  else cb(new Error('Not an image! Please upload only images.'), false);
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

// ------------------- HELPER FUNCTION -------------------

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// ------------------- USER ROUTES -------------------

exports.getAll = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Block password updates
  if (req.body.password || req.body.passwordConfirm) {
    return res.status(400).json({
      status: 'error',
      message: 'This route is not for password updates. Please use /updateMyPassword.',
    });
  }

  // 2) Filter allowed fields
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: { user: updatedUser },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// ------------------- FACTORY ROUTES -------------------

exports.getOne = factory.getOne(User);
exports.updateOne = factory.updateOne(User);
exports.deleteOne = factory.deleteOne(User);

exports.createOne = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
