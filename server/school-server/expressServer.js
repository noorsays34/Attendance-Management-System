const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config');
const logger = require('./logger');
const { setupRoutes } = require('./utils/openapiRouter');

const app = express();

// Middleware
app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Strip ALB path prefix for path-based routing
app.use((req, res, next) => {
  if (req.url.startsWith('/Saishma')) {
    req.url = req.url.replace('/Saishma', '');
  }
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// List all routes (debug helper)
app.get('/api/v1/routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach(r => {
    if (r.route) routes.push(`${Object.keys(r.route.methods)[0].toUpperCase()} ${r.route.path}`);
  });
  res.json(routes);
});

// Setup API routes
setupRoutes(app);

// 404 handler
app.use((req, res) => {
  logger.warn(`404 Not Found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

module.exports = app;
