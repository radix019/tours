const express = require("express");
const router = express.Router();
const {
  deleteTour,
  fetchTourById,
  fetchTours,
  postTour,
  updateTour,
  checkBody,
} = require("./../controllers/tourController");

router.route("/").get(fetchTours).post(checkBody, postTour);
router.route("/:id").get(fetchTourById).get(updateTour).delete(deleteTour);

module.exports = router;
