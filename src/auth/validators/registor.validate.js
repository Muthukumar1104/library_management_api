const { body } = require('express-validator');

function UserRegisterValidation() {
  return [
    body('name', 'Invalid password').notEmpty().exists(),
    body('email', 'Invalid email').isEmail().normalizeEmail().toLowerCase().exists(),
    body('mobile', 'Invalid mobile number').notEmpty().exists(),
    body('password', 'Invalid password').notEmpty().exists(),
  ];
}

module.exports = UserRegisterValidation;
