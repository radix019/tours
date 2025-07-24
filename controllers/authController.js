const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../Model/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const getIdFromJWT = async (req, next) => {
  let token;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  }
  if (!token) {
    return next(new AppError('Please log in to get access', 401));
  }
  return await promisify(jwt.verify)(token, process.env.JWT_SECRET);
};
exports.sendCookie = (res, token) => {
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 1000 * 60 * 60 * 24,
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
};
exports.signup = catchAsync(async (req, res, _) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    role: req.body.role,
  });
  const token = generateToken(newUser._id);
  newUser.password = undefined;
  newUser.passwordChangedAt = undefined;
  this.sendCookie(res, token);
  res.status(201).json({
    status: 'Success',
    token,
    data: {
      user: newUser,
    },
  });
});
exports.signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide the login details!', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  console.log('user', user);

  if (!user || !(await user.verifyPassword(password, user.password))) {
    return next(new AppError('Incorrect Email or Password', 401));
  }
  const token = this.generateToken(user._id);
  this.sendCookie(res, token);
  res.status(200).json({
    status: 'Success',
    token,
  });
});

exports.protectedRoute = catchAsync(async (req, _, next) => {
  const decodeToken = await getIdFromJWT(req, next);
  const currentUser = await User.findById(decodeToken.id);
  if (!currentUser) {
    return next(new AppError('user no longer exist!', 401));
  }
  req.user = currentUser;
  next();
});
exports.restrictTo = (...roles) => {
  return (req, _, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Not permitted to action!', 403));
    }
    next();
  };
};
