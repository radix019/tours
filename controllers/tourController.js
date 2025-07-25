const Tour = require('../Model/toursModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getTours = factory.getAll(Tour);
exports.getTourById = factory.getOne(Tour, 'reviews');

exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOnebyId(Tour);
exports.deleteTour = factory.deleteOne(Tour);
exports.getTourStats = catchAsync(async (__, res, _) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: {
        avgPrice: 1,
      },
    },
    {
      $match: { _id: { $ne: 'EASY' } },
    },
  ]);
  res.status(200).json({
    status: 'Success',
    data: {
      stats,
    },
  });
});
exports.getMonthlyPlan = catchAsync(async (__, res, _) => {
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
  ]);
  res.status(200).json({
    status: 'Success',
    data: {
      plan,
    },
  });
});
