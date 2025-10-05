const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const errorController = require('./controllers/errorController');
const logger = require('./utils/logger');

require('./config/passport');

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

// Home route
app.get('/', (req, res) => {
  res.render('index', { user: req.user });
});

// Error handling middleware
app.use(errorController.handleNotFound);
app.use(errorController.handleErrors);

module.exports = app;
