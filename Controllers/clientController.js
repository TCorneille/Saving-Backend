const User = require('../Models/userModel');
const Transaction = require('../Models/accountModel');
const AppError = require('../Utils/appError');
const catchAsync = require('../Utils/catchAsync');
const sendEmail = require('../Utils/email');

// View Dashboard: Balance + Transaction History
exports.getDashboard = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('name email balance');
  const transactions = await Transaction.find({ user: req.user.id }).sort('-createdAt');

  res.status(200).json({
    status: 'success',
    data: {
      user,
      transactions
    }
  });
});

//  Deposit
exports.deposit = catchAsync(async (req, res, next) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) return next(new AppError('Invalid deposit amount', 400));

  const user = await User.findById(req.user.id);
  user.balance += amount;
  await user.save({ validateBeforeSave: false });

  await Transaction.create({
    user: req.user.id,
    type: 'deposit',
    amount,
    description: `Deposit of ${amount}`
  });

  // Send deposit confirmation email
  await sendEmail({
    email: user.email,
    subject: 'Deposit Confirmation',
    message: `Hi ${user.name}, your deposit of $${amount} was successful!`
  });

  res.status(200).json({
    status: 'success',
    message: 'Deposit successful',
    newBalance: user.balance
  });
});

//  Withdraw
exports.withdraw = catchAsync(async (req, res, next) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) return next(new AppError('Invalid withdrawal amount', 400));

  const user = await User.findById(req.user.id);

  if (amount > user.balance)
    return next(new AppError('Insufficient funds', 400));

  user.balance -= amount;
  await user.save({ validateBeforeSave: false });

  await Transaction.create({
    user: req.user.id,
    type: 'withdraw',
    amount,
    description: `Withdrawal of ${amount}`
  });

  // Low balance warning (optional)
  if (user.balance < 50) {
    await sendEmail({
      email: user.email,
      subject: 'Low Balance Warning',
      message: `Hi ${user.name}, your account balance is low ($${user.balance}). Please deposit soon.`
    });
  }

  res.status(200).json({
    status: 'success',
    message: 'Withdrawal successful',
    newBalance: user.balance
  });
});
