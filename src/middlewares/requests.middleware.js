import models from '../db/models';

const { Request } = models;

const requestChecks = {
  async validateRequests(req, res, next) {
    const request = await Request.count({ where: { id: req.params.id } });
    if (request < 1) {
      return res.status(404).json({
        status: 'error',
        error: 'This request does not exist'
      });
    }
    return next();
  }
};

export default requestChecks;
