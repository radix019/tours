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
router
  .route('/')
  .get(getTours)
  .post(protectedRoute, restrictTo('admin'), createTour);
router.route('/get-stats').get(getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    protectedRoute,
    restrictTo('admin', 'lead-guide', 'guide'),
    getMonthlyPlan,
  );
router
  .route('/:id')
  .get(getTourById)
  .patch(protectedRoute, restrictTo('admin', 'lead-guide'), updateTour)
  .delete(protectedRoute, restrictTo('admin', 'lead-guide'), deleteTour);
module.exports = router;
