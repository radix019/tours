const express = require('express');
const router = express.Router();
const {
  deleteTour,
  getTourById,
  getTours,
  createTour,
  updateTour,
  getTourStats,
  getMonthlyPlan,
} = require('./../controllers/tourController');
const { protectedRoute, restrictTo } = require('../controllers/authController');
const reviewRouters = require('./review');

router.use('/:tourId/reviews', reviewRouters);
router.route('/').get(getTours).post(createTour);
router.route('/get-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
router
  .route('/:id')
  .get(getTourById)
  .patch(updateTour)
  .delete(protectedRoute, restrictTo('admin', 'lead-guide'), deleteTour);
// router
//   .route('/:tourId/reviews')
//   .post(protectedRoute, restrictTo('user'), createReview);

module.exports = router;
