const Tour = require('../Model/toursModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.getTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .paginate()
      .limitFields()
      .sort();
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
exports.getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (error) {
    res.status(404).json({
      status: 404,
      message: `Failed to get the Tour!: ${error.message}`,
    });
  }
};
exports.createTour = (req, res) => {
  new Tour(req.body)
    .save()
    .then(() => {
      console.log('Document saved!');
      res.status(201).send('Document Saved Successfully!');
    })
    .catch((error) =>
      res.status(400).json({
        status: 'Error while saving the Document',
        message: error.message,
      }),
    );
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      updatedData: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'Error while updating the Document',
      message: error.message,
    });
  }
};
exports.deleteTour = async (req, res) => {
  try {
    const deletedTour = await Tour.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: 'Success',
      data: {
        deletedTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'Failed',
      error: error.message,
    });
  }
};
exports.getTourStats = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(400).json({
      status: 'Failed',
      error: error.message,
    });
  }
};
exports.getMonthlyPlan = async (req, res) => {
  try {
    // const year = req.params.year * 1;
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
  } catch (error) {
    res.status(400).json({
      status: 'Failed',
      error: error.message,
    });
  }
};
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
