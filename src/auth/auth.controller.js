/* eslint-disable no-unused-vars */
const express = require('express');
const UserRegisterValidation = require('./validators/registor.validate');
const AuthService = require('./auth.service');
const { validate } = require('../infrastructures/utils/validation');
const UserLoginValidation = require('./validators/login.validate');
const { authenticateJWT } = require('../infrastructures/middlewares/authenticate.middleware');
const router = express.Router();

const authService = new AuthService();

// Register
router.post('/signup', UserRegisterValidation(), validate, authService.signUp);

// Login
router.post('/login', UserLoginValidation(), validate, authService.logIn);
router.get('/logout', authenticateJWT, authService.logOut);
router.post('/forget-password', authService.forgetPassword);

// Me
router.get('/me', authenticateJWT, authService.me);

module.exports = router;
