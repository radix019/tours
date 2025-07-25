const User = require('../Model/userModel');
const catchAsync = require('../utils/catchAsync');
const crypto = require('crypto');
const sendEamil = require('../utils/sendEmail');
const { sendCookie, generateToken } = require('./authController');
const factory = require('./handlerFactory');

exports.fetchUsers = factory.getAll(User);
exports.fetchUserById = factory.getOne(User);
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('User does not exist!', 404));
  }
  const resetToken = await user.createPswdResetToken();
  await user.save({
    validateBeforeSave: false,
  });
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`;
  const emailMessage = `Forgot your password? Click <a href="${resetURL}" target=_blank>here</a> to reset your password.\n If you didn't forget your password, please ignore this email!`;
  try {
    await sendEamil({
      email: user.email,
      subject: 'Your password reset token (Valid for 10 min)',
      message: emailMessage,
    });
    res
      .status(200)
      .send(
        '<h3>Please check your email for Password Reset instructions!</h3>',
      );
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpire = undefined;
    await user.save({
      validateBeforeSave: false,
    });
    console.log('error', error);
    return next(
      new AppError(
        'There was an error while sending the email. Please try again later!',
        500,
      ),
    );
  }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or expired', 400));
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpire = undefined;

  await user.save();
  const token = generateToken(user._id);
  res.status(200).json({
    status: 'Success',
    message: 'Password changed successfully!',
    token,
  });
});
exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return next(new AppError('Please provide the new Password details!', 400));
  }
  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.verifyPassword(currentPassword, user.password))) {
    next(new AppError('Wrong current Password!', 400));
  }
  const isConfirmNewPassword = newPassword === confirmNewPassword;
  if (!isConfirmNewPassword) {
    next(new AppError('New Passwords does not match!', 400));
  }
  user.password = req.body.newPassword;
  user.confirmPassword = req.body.confirmNewPassword;
  await user.save();
  const token = generateToken(user._id);
  sendCookie(res, token);
  res.status(200).json({
    status: 'Success',
    message: 'Password Updated successfully!',
    token,
  });
});

exports.updateProfile = factory.updateOnebyId(User);
exports.deleteProfile = factory.deleteOne(User);
