const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Enter a valid email'],
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Minimum 6 characters'],
    select: false,
  },
  passwordResetToken: String,
  passwordResetTokenExpire: Date,
  passwordChangedAt: { type: Date, select: false },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  active: {
    type: Boolean,
    default: true,
  },
});

userSchema
  .virtual('confirmPassword')
  .set(function (value) {
    this._confirmPassword = value;
  })
  .get(function () {
    return this._confirmPassword;
  });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.isNew) return next();
  if (this.password !== this._confirmPassword) {
    return next(new Error('Passwords do not match!', 400));
  }
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
// instance methods: to be called on Document.
userSchema.methods.verifyPassword = async function (
  inputPasswd,
  originalPasswd,
) {
  return await bcrypt.compare(inputPasswd, originalPasswd);
};
userSchema.methods.createPswdResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetTokenExpire = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});
const User = mongoose.model('User', userSchema);
module.exports = User;
