console.log('=== DEBUGGING REQUIRE CHAIN ===');

try {
  console.log('1. Loading dotenv...');
  require('dotenv').config();
  console.log('✅ dotenv loaded');
} catch(e) { console.log('❌ dotenv:', e.message); }

try {
  console.log('2. Loading User model...');
  const User = require('../models/User');
  console.log('✅ User model loaded');
} catch(e) { console.log('❌ User model:', e.message); }

try {
  console.log('3. Loading passport config...');
  require('./config/passport');
  console.log('✅ passport config loaded');
} catch(e) { console.log('❌ passport config:', e.message); }

try {
  console.log('4. Loading auth routes...');
  const authRoutes = require('./routes/auth');
  console.log('✅ auth routes loaded');
} catch(e) { console.log('❌ auth routes:', e.message); }

try {
  console.log('5. Loading app.js...');
  const app = require('./app');
  console.log('✅ app.js loaded');
} catch(e) { console.log('❌ app.js:', e.message); }

console.log('=== DEBUG COMPLETE ===');
