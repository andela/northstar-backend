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
  },

  async checkRequestStatus(req, res, next) {
    const existingRequest = await Request.findByPk(req.params.id);

    // if (existingRequest) {
    //   return res.status(404).json({
    //     status: 'error',
    //     error: 'Request not found'
    //   });
    // }

    const isOwner = (existingRequest.user_id === req.body.user_id);
    if (isOwner) {
      return res.status(403).json({
        status: 'error',
        error: ' You cannot edit this request'
      });
    }

    return existingRequest.status === 'pending'
      ? next()
      : res.status(400).json({
        status: 'error',
        error: 'You cannot update a request that is not pending'
      });
  }
};

export default requestChecks;
