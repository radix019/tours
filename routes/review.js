const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  fetchReviews,
  createReview,
  deleteReview,
  updateReview,
  setTourUserIds,
} = require('../controllers/reviewController');
const { protectedRoute, restrictTo } = require('../controllers/authController');

router
  .route('/:id')
  .patch(protectedRoute, updateReview)
  .delete(protectedRoute, restrictTo('user'), deleteReview);
router
  .route('/')
  .get(protectedRoute, fetchReviews)
  .post(protectedRoute, restrictTo('user'), setTourUserIds, createReview);

module.exports = router;
