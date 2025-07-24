const express = require('express');
const router = express.Router();
const {
  fetchReviews,
  createReview,
} = require('../controllers/reviewController');
const { protectedRoute, restrictTo } = require('../controllers/authController');

router
  .route('/')
  .get(protectedRoute, fetchReviews)
  .post(protectedRoute, restrictTo('user'), createReview);
module.exports = router;
