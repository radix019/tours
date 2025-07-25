const AppError = require('./appError');

const sendErrDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    stack: err.stack,
    message: err.message,
  });
};

const sendErrProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log('ERROR: ', err);
    res.status(500).json({
      status: 'Error',
      message: 'Something went wrong!',
    });
  }
};
const handleDBcastError = (error) => {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new AppError(message, 400);
};
const handleTokenError = () =>
  new AppError('Unable to verify you. Please login again', 401);

module.exports = (err, _, res, __) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    console.log('EROR: ', error);
    if (error.name === 'CastError') {
      error = handleDBcastError(error);
    }
    if (error.name === 'TokenExpiredError') {
      error = handleTokenError(error);
    }
    sendErrProd(error, res);
  }
};
