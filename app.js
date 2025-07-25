const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./utils/errorController');
const tourRouter = require('./routes/tour');
const userRouter = require('./routes/user');
const reviewRouter = require('./routes/review');

const app = express();
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 50,
  windowMs: 60 * 60 * 1000,
  message: 'Request limits exceeded. Please try again after 1 hour',
});
app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize()); // to prevent NOSQL injections. e.g. "email": {"$gt":""}
app.use(xss());
app.use(
  hpp({
    whitelist: ['duration'],
  }),
);

app.use('/api', limiter);
app.use(express.static(`${__dirname}/public`));
app.use((req, _, next) => {
  req.requestTime = new Date().toISOString();
  console.log('Headers: ', req.headers);
  next();
});
// Global Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Couldn't find ${req.originalUrl} on the server!`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
