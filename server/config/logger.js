const winston = require('winston');

// Create a custom logger instance
const logger = winston.createLogger({
  level: 'info', // Default logging level
  format: winston.format.combine(
    winston.format.colorize(), // Add color to log messages
    winston.format.timestamp(), // Add timestamp to logs
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
  transports: [
    // Log to console
    new winston.transports.Console(),
    // Optionally, log to a file
    new winston.transports.File({ filename: 'application.log' })
  ]
});

// Export the logger for use in other files
module.exports = logger;
