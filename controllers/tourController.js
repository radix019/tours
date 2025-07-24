const Tour = require('../Model/toursModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('./../utils/apiFeatures');

exports.getTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query);
    // .filter()
    // .paginate()
    // .limitFields()
    // .sort();
    const tours = await features.query;
    res.status(200).json({
      results: tours?.length ?? 0,
      status: 'success',
      data: tours,
    });
  } catch (error) {
    res.status(400).json({
      status: 400,
      message: error.message,
    });
  }
};
exports.getTourById = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate('reviews');
  if (!tour) {
    return next(new AppError(`Tour not found with ID: ${req.params.id}`, 404));
  }
  res.status(200).json({
    status: 'success',
    data: { tour },
  });
});

exports.createTour = catchAsync(async (req, res, _) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'Success',
    data: {
      tour: newTour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!tour) {
    return next(new AppError(`Tour not found with ID: ${req.params.id}`, 404));
  }
  res.status(200).json({
    status: 'success',
    updatedData: {
      tour,
    },
  });
});
exports.deleteTour = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const deletedTour = await Tour.findByIdAndDelete(id);
  console.log('deletedTour', deletedTour);
  if (!deletedTour) {
    return next(new AppError(`Tour not found with ID: ${id}`, 404));
  }
  res.status(200).json({
    status: 'Success',
    data: {
      deletedTour,
    },
  });
});
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
// exports.checkBody = (req, res, next) => {
//   const requestedTour = req.body;
//   if (!requestedTour.name || !requestedTour.price) {
//     res.status(400).json({
//       status: '400 Bad Request',
//       message: 'Name or Price is missing',
//     });
//   } else {
//     next();
//   }
// };
