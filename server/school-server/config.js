const config = {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
};

module.exports = config;
