const fs = require("fs");
const tours = JSON.parse(fs.readFileSync("./dev-data/data/tours-simple.json"));

exports.fetchUsers = (_, res) => {
  const users = tours.map((user) => user.name);
  res.status(200).json({
    result: users.length,
    status: "success",
    data: { users },
  });
};
exports.fetchUserbyId = () => {};
exports.createUser = (req, res) => {};
exports.patchUser = (req, res) => {};
exports.deleteUser = () => {};
