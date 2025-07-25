const express = require('express');
const router = express.Router();
const { ROUTES_PATH } = require('../utils/constants');
const {
  signup,
  signin,
  protectedRoute,
  restrictTo,
} = require('../controllers/authController');
const {
  fetchUsers,
  deleteProfile,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateProfile,
  fetchUserById,
  getMe,
} = require('./../controllers/userController');

router.post(ROUTES_PATH.SIGNUP, signup);
router.post(ROUTES_PATH.SIGNIN, signin);
router.post(ROUTES_PATH.FORGOT_PSWD, forgotPassword);

router.use(protectedRoute); // another way to protect all routes instead of one like (ROUTES_PATH.RESET_PSWD, protectedRoute, resetPassword);
router.patch(ROUTES_PATH.RESET_PSWD, resetPassword);
router.patch(ROUTES_PATH.UPDATE_PSWD, updatePassword);
router.patch(ROUTES_PATH.UPDATE_PROFILE, updateProfile);
router.route('/me').get(getMe, fetchUserById);

router
  .route('/:id')
  .get(fetchUserById)
  .delete(restrictTo('admin'), deleteProfile);
router.route('/').get(fetchUsers);

module.exports = router;
