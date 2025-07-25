const Review = require('../Model/reviewModel');
const catchAsync = require('../utils/catchAsync');
const { generateToken } = require('./authController');

exports.fetchReviews = catchAsync(async (req, res) => {
  let query = {};
  if (req.params.tourId) query = { tour: req.params.tourId };
  const reviews = await Review.find(query);
  const token = generateToken(req.user.id);
  res.status(200).json({
    status: 'Success',
    result: reviews.length,
    token,
    data: {
      reviews,
    },
  });
});
exports.createReview = catchAsync(async (req, res) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  const newReview = await Review.create(req.body);
  const token = generateToken(req.user.id);
  res.status(201).json({
    status: 'Success',
    token,
    data: {
      newReview,
    },
  });
});
