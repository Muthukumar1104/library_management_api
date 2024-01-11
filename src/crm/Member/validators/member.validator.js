const { body } = require('express-validator');

function SaveMemberValidation() {
  return [
    body('name', 'Invalid name').notEmpty().exists(),
    body('mobile', 'Invalid mobile').notEmpty().exists(),
    body('address', 'Invalid address').notEmpty().exists(),
  ];
}

module.exports = SaveMemberValidation;
