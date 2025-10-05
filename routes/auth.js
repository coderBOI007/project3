const express = require('express');
const passport = require('passport');
const { ensureGuest } = require('../middleware/auth');
const authController = require('../controllers/authController');
const { validateUser } = require('../middleware/validation');

const router = express.Router();

// Login routes
router.get('/login', ensureGuest, authController.getLogin);
router.post('/login', ensureGuest, authController.postLogin);

// Signup routes
router.get('/signup', ensureGuest, authController.getSignup);
router.post('/signup', ensureGuest, validateUser, authController.postSignup);

// Logout route
router.get('/logout', authController.logout);

module.exports = router;