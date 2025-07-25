const Review = require('../Model/reviewModel');
const factory = require('./handlerFactory');

exports.fetchReviews = factory.getAll(Review);
exports.setTourUserIds = (req, _, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
exports.createReview = factory.createOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOnebyId(Review);
