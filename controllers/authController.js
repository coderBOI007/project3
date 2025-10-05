const User = require('../models/User');
const passport = require('passport');
const logger = require('../utils/logger');

exports.getLogin = (req, res) => {
  res.render('auth/login', { error: null });
};

exports.getSignup = (req, res) => {
  res.render('auth/signup', { error: null });
};

exports.postSignup = async (req, res, next) => {
  try {
    const { username, password, confirmPassword } = req.body;

    // Validation
    if (password !== confirmPassword) {
      return res.render('auth/signup', { 
        error: 'Passwords do not match',
        username 
      });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.render('auth/signup', { 
        error: 'Username already exists',
        username 
      });
    }

    const user = new User({ username, password });
    await user.save();

    logger.info(`New user registered: ${username}`);
    res.redirect('/auth/login');
  } catch (error) {
    logger.error('Signup error:', error);
    next(error);
  }
};

exports.postLogin = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.render('auth/login', { 
        error: info.message 
      });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      logger.info(`User logged in: ${user.username}`);
      return res.redirect('/tasks');
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      logger.error('Logout error:', err);
      return next(err);
    }
    res.redirect('/');
  });
};
