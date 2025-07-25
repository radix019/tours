const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createOne = (Model) =>
  catchAsync(async (req, res, _) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'Success',
      created: {
        [Model.modelName]: doc,
      },
    });
  });
exports.getOne = (Model, populateWith) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateWith?.length)
      query = Model.findById(req.params.id).populate(populateWith);
    const doc = await query;
    if (!doc) {
      return next(
        new AppError(`Document not found with ID: ${req.params.id}`, 404),
      );
    }
    res.status(200).json({
      status: 'success',
      data: {
        [Model.modelName]: doc,
      },
    });
  });
exports.getAll = (Model) =>
  catchAsync(async (req, res) => {
    let query = {}; // for nested with Tours
    if (req.params.tourId) query = { tour: req.params.tourId };
    const features = new APIFeatures(Model.find(query), req.query)
      .filter()
      .paginate()
      .limitFields()
      .sort();
    const docs = await features.query;
    res.status(200).json({
      results: docs?.length ?? 0,
      status: 'success',
      data: {
        [Model.modelName]: docs,
      },
    });
  });
exports.updateOnebyId = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) {
      return next(
        new AppError(`Document not found with ID: ${req.params.id}`, 404),
      );
    }
    res.status(200).json({
      status: 'success',
      updated: {
        [Model.modelName]: doc,
      },
    });
  });
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const doc = await Model.findByIdAndDelete(id);
    if (!doc) {
      return next(new AppError(`Document not found with ID: ${id}`, 404));
    }
    res.status(204).json({
      status: 'Success',
      deleted: {
        [Model.modelName]: doc,
      },
    });
  });
