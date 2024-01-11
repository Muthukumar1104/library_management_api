// eslint-disable-next-line no-unused-vars
const ErrorHandler = (err, req, res, next) => {
  const errStatus = err.status || 500;
  const errMsg = err.message || 'Something went wrong';
  res.status(errStatus).json({
      success: false,
      status: errStatus,
      message: errMsg,
      // eslint-disable-next-line no-undef
      stack: process.env.STAGE === 'dev' ? err.stack : {}
  })
}

module.exports = ErrorHandler