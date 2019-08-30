const validateRequests = {
  async validateRequestsID(req, res, next) {
    if (!Number(req.params.id)) {
      return res.status(422).json({
        status: 'error',
        error: 'This id is invalid. ID must be a number!'
      });
    }
    return next();
  }
};

export default validateRequests;
