const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tour');
const userRouter = require('./routes/user');

const app = express();

// middlewares
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.static(`${__dirname}/public`));
// Global Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users/', userRouter);

module.exports = app;
