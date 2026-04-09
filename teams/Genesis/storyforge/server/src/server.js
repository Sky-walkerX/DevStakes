/**
 * EXPRESS SERVER ENTRY POINT
 * - Initialize Express app
 * - Configure middleware (cors, json parser, rate limiter)
 * - Mount story routes on /api/story
 * - Set up error handling middleware
 * - Start server on port from .env (default 3000)
 * - Export app for testing
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const storyRoutes = require('./routes/storyRoutes');
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Rate Limiting
app.use('/api', rateLimiter);

// Routes
app.use('/api/story', storyRoutes);

// Base route for health check
app.get('/', (req, res) => {
  res.json({ message: 'StoryForge API is running' });
});

// Error Handling Middleware MUST be last
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});

module.exports = app;