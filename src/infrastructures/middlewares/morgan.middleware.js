const morgan = require('morgan');
const winston = require('winston');

const { format } = winston;

const logger = winston.createLogger({
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf((msg) => {
      return `${msg.timestamp} [${msg.level}] ${msg.message}`;
    }),
  ),
  transports: [new winston.transports.Console({ level: 'http' })],
});

module.exports.morganMiddleware = morgan(':method :url :status :res[content-length] - :response-time ms', {
  stream: {
    write: (message) => logger.http(message.trim()),
  },
});
