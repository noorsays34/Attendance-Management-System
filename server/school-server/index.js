const app = require('./expressServer');
const config = require('./config');
const logger = require('./logger');

app.listen(config.port, () => {
  logger.info(`🚀 School Attendance Server running on http://localhost:${config.port}`);
  logger.info(`📚 Environment: ${config.env}`);
});
