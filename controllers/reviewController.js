const Review = require('../Model/reviewModel');
const catchAsync = require('../utils/catchAsync');
const { generateToken } = require('./authController');

exports.fetchReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();
  const token = generateToken(req.user.id);
  res.status(200).json({
    status: 'Success',
    token,
    data: {
      reviews,
    },
  });
});
exports.createReview = catchAsync(async (req, res, next) => {
  const { review, rating, tour, user } = req.body;
  const newReview = await Review.create({ review, rating, tour, user });
  const token = generateToken(req.user.id);
  res.status(201).json({
    status: 'Success',
    token,
    data: {
      newReview,
    },
  });
});
