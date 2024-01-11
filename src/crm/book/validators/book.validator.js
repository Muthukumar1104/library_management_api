const { body } = require('express-validator');

function SaveBookValidation() {
  return [
    body('title', 'Invalid title').notEmpty().exists(),
    body('author', 'Invalid author').notEmpty().exists(),
    body('quantity', 'Invalid quanity').notEmpty().exists(),
    body('rentfee', 'Invalid rentfee').notEmpty().exists(),
  ];
}

module.exports = SaveBookValidation;
