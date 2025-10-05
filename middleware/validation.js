const { body, validationResult } = require('express-validator');

const validateUser = [
  body('username')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long')
    .trim()
    .escape(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

const validateTask = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters')
    .trim()
    .escape(),
  
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
    .trim()
    .escape(),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateUser,
  validateTask,
  handleValidationErrors
};