const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Simple auth middleware function
const ensureAuth = (req, res, next) => {
  if (req.user) {
    return next();
  }
  res.redirect('/auth/login');
};

// Apply auth middleware to all task routes
router.use(ensureAuth);

// Task routes
router.get('/', taskController.getTasks);
router.post('/', taskController.createTask);
router.post('/:id/status', taskController.updateTaskStatus);
router.post('/:id/delete', taskController.deleteTask);

module.exports = router;
