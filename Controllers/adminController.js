const User = require('../Models/userModel');
const AppError = require('../Utils/appError');
const catchAsync = require('../Utils/catchAsync');

// 🧩 View all customers
exports.getAllCustomers = catchAsync(async (req, res, next) => {
  const users = await User.find({ role: 'client' });
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users }
  });
});

// 💰 View all customer balances
exports.getAllBalances = catchAsync(async (req, res, next) => {
  const users = await User.find({ role: 'client' }).select('name email balance');
  res.status(200).json({
    status: 'success',
    data: { users }
  });
});

// 📱 Verify or update a customer's device ID
exports.verifyDeviceId = catchAsync(async (req, res, next) => {
  const { userId, deviceId } = req.body;

  const user = await User.findByIdAndUpdate(
    userId,
    { deviceId },
    { new: true, runValidators: true }
  );

  if (!user) return next(new AppError('No user found with that ID', 404));

  res.status(200).json({
    status: 'success',
    message: 'Device ID verified/updated successfully',
    data: { user }
  });
});

// 📊 Optional dashboard: total balances, user count, etc.
exports.getDashboardStats = catchAsync(async (req, res, next) => {
  const stats = await User.aggregate([
    { $match: { role: 'client' } },
    {
      $group: {
        _id: null,
        totalClients: { $sum: 1 },
        totalBalance: { $sum: '$balance' },
        avgBalance: { $avg: '$balance' }
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    data: { stats: stats[0] || {} }
  });
});
