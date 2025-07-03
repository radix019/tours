const express = require("express");
const router = express.Router();
const {
  fetchUserbyId,
  fetchUsers,
  createUser,
  deleteUser,
  patchUser,
} = require("./../controllers/userController");

router.route("/").get(fetchUsers).post(createUser);
router.route("/:id").get(fetchUserbyId).patch(patchUser).delete(deleteUser);

module.exports = router;
