const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Transaction must belong to a user']
  },
  type: {
    type: String,
    enum: ['deposit', 'withdraw'],
    required: [true, 'Transaction must have a type']
  },
  amount: {
    type: Number,
    required: [true, 'Transaction must have an amount'],
    min: [1, 'Transaction amount must be positive']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  description: String
});

// Auto populate user name/email
transactionSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: 'name email' });
  next();
});

const Account = mongoose.model('Account', transactionSchema);
module.exports = Account;
