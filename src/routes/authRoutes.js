const express = require('express');
const router = express.Router();
const apiLimiter = require('../middlewares/rateLimit');
const authController = require('../controllers/authController');

router.post('/login', apiLimiter, authController.login);
router.get('/forgotPassword', apiLimiter, authController.forgotPassword);
router.patch('/resetPassword/:token', apiLimiter, authController.resetPassword);

module.exports = router;