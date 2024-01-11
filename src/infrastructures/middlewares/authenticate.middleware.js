const jwt = require('jsonwebtoken');
const CustomError = require('../errors/custom.error');

module.exports.authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    // eslint-disable-next-line no-undef
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        throw new CustomError('Unauthorized', 403);
      }
      req.user = user;
      next();
    });
  } else {
   throw new CustomError('Unauthorized', 401);
  }
};
