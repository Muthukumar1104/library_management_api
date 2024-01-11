class CustomError {
    message;
    status;
  
    constructor(message, status = 500) {
      this.message = message;
      this.status = status;
    }
  }

module.exports = CustomError;