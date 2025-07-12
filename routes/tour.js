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

router.route('/').get(getTours).post(createTour);
router.route('/get-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
router.route('/:id').get(getTourById).patch(updateTour).delete(deleteTour);

module.exports = router;
