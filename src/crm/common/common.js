const { isValidObjectId } = require('mongoose');
const CustomError = require('../../infrastructures/errors/custom.error');

module.exports = class Common {
  async isObjectId(id) {
    if (!isValidObjectId(id)) throw new CustomError('Id not valid', 400);
    return;
  }
};
