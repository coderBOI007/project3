cat > server.js << 'EOF'
require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Bind to 0.0.0.0 for Render deployment
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server running on port ${PORT} (bound to 0.0.0.0)`);
  console.log(`✅ Server is live and accessible externally`);
});
EOF