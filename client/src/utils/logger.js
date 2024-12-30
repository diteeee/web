// client/src/utils/logger.js
import log from "loglevel";

log.setLevel("debug"); // You can set this dynamically based on environment variables

const logger = {
  info: (message) => log.info(message),
  warn: (message) => log.warn(message),
  error: (message) => log.error(message),
  debug: (message) => log.debug(message),
};

export default logger;
