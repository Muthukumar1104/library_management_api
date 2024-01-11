const jwt = require('jsonwebtoken');
const logger = require('./logger');

module.exports.generateAccessToken = (userInfo) => {
  logger.log(userInfo);
  // eslint-disable-next-line no-undef
  return jwt.sign(userInfo, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
};
