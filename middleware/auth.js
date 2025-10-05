const logger = require('../utils/logger');

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  
  logger.warn('Unauthorized access attempt');
  res.redirect('/login');
};

const ensureGuest = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/tasks');
};

module.exports = {
  ensureAuthenticated,
  ensureGuest
};