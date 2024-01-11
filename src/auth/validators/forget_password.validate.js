const { body } = require('express-validator');

function ForgetPasswordValidation() {
  return [
    body('email', 'Invalid email').isEmail().normalizeEmail().toLowerCase().exists(),
    body('password', 'Invalid password').exists(),
  ];
}

module.exports = ForgetPasswordValidation;
