const fs = require("fs");

const tours = JSON.parse(fs.readFileSync("./dev-data/data/tours-simple.json"));

exports.fetchTours = (req, res) => {
  res.status(200).json({
    results: tours.length,
    status: "success",
    data: { tours },
  });
};
exports.postTour = (req, res) => {
  const newID = tours.at(-1).id + 1;
  const newTour = Object.assign({ id: newID }, req.body);
  tours.push(newTour);
  fs.writeFile(
    "./dev-data/data/tours-simple.json",
    JSON.stringify(tours),
    () => {
      res.status(201).json({
        status: "success",
        data: {
          newTour,
        },
      });
    }
  );
};
exports.fetchTourById = (req, res) => {
  const { id } = req.params;
  try {
    const tour = tours.find((tour) => tour.id === Number(id));
    res.status(200).json({
      result: tour.length,
      status: "success",
      data: { tour },
    });
  } catch (error) {
    res.status(404).json({
      status: 404,
      message: "Tour does not exist!",
    });
  }
};
exports.updateTour = () => {};
exports.deleteTour = () => {};
exports.checkBody = (req, res, next) => {
  const requestedTour = req.body;
  if (!requestedTour.name || !requestedTour.price) {
    res.status(400).json({
      status: "400 Bad Request",
      message: "Name or Price is missing",
    });
  } else {
    next();
  }
};
