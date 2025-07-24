const express = require('express');
const router = express.Router();
const { ROUTES_PATH } = require('../utils/constants');
const {
  signup,
  signin,
  protectedRoute,
} = require('../controllers/authController');
const {
  fetchUsers,
  deleteProfile,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateProfile,
} = require('./../controllers/userController');

router.post(ROUTES_PATH.SIGNUP, signup);
router.post(ROUTES_PATH.SIGNIN, signin);
router.post(ROUTES_PATH.FORGOT_PSWD, forgotPassword);

router.patch(ROUTES_PATH.RESET_PSWD, resetPassword);
router.patch(ROUTES_PATH.UPDATE_PSWD, protectedRoute, updatePassword);
router.patch(ROUTES_PATH.UPDATE_PROFILE, protectedRoute, updateProfile);

router.delete(ROUTES_PATH.DELETE_PROFILE, protectedRoute, deleteProfile);
router.route('/').get(protectedRoute, fetchUsers);

module.exports = router;
