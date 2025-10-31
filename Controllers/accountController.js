const mongoose = require('mongoose');
const User = require('../Models/userModel');
const Transaction = require('../Models/accountModel');
const AppError = require('../Utils/appError');
const catchAsync = require('../Utils/catchAsync');

// =====================================
//  DASHBOARD: Balance + Transaction History
// =====================================
exports.getDashboard = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('name email balance');
  if (!user) return next(new AppError('User not found', 404));

  const transactions = await Transaction.find({ user: req.user.id }).sort('-createdAt');

  res.status(200).json({
    status: 'success',
    data: {
      user,
      transactions
    }
  });
});

// =====================================
//  DEPOSIT
// =====================================
exports.deposit = catchAsync(async (req, res, next) => {
  const amount = Number(req.body.amount);

  if (isNaN(amount) || amount <= 0)
    return next(new AppError('Invalid deposit amount', 400));

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Update balance atomically
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { balance: amount } },
      { new: true, runValidators: false, session }
    );

    if (!user) {
      await session.abortTransaction();
      return next(new AppError('User not found', 404));
    }

    // Record transaction
    await Transaction.create(
      [{
        user: req.user.id,
        type: 'deposit',
        amount,
        description: `Deposit of ${amount}`,
        reference: `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      status: 'success',
      message: 'Deposit successful',
      newBalance: user.balance
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return next(new AppError('Transaction failed, please try again', 500));
  }
});

// =====================================
//  WITHDRAW
// =====================================
exports.withdraw = catchAsync(async (req, res, next) => {
  const amount = Number(req.body.amount);

  if (isNaN(amount) || amount <= 0)
    return next(new AppError('Invalid withdrawal amount', 400));

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(req.user.id).session(session);
    if (!user) {
      await session.abortTransaction();
      return next(new AppError('User not found', 404));
    }

    if (amount > user.balance) {
      await session.abortTransaction();
      return next(new AppError('Insufficient funds', 400));
    }

    // Deduct balance atomically
    user.balance -= amount;
    await user.save({ session, validateBeforeSave: false });

    // Record transaction
    await Transaction.create(
      [{
        user: req.user.id,
        type: 'withdraw',
        amount,
        description: `Withdrawal of ${amount}`,
        reference: `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      status: 'success',
      message: 'Withdrawal successful',
      newBalance: user.balance
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return next(new AppError('Transaction failed, please try again', 500));
  }
});
