import models from '../db/models/index';

const { Request, User } = models;

const ensureUserCanPost = async (req, res, next) => {
  const { request_id, user } = req.body;

  try {
    const request = await Request.findByPk(request_id);
    if (!request[1][0]) {
      return res.send(404).json({
        status: 'error',
        error: 'Request not found.'
      });
    }
    // move to controller if user owns the request
    if (request.user_id === user.id) return next();
    const requester = await User.findByPk(request.user_id);
    const isManager = requester.manager_id === user.id;

    // move to controller if request's owner is user's direct report
    return isManager
      ? next()
      : res.status(403).json({
        status: 'error',
        error: 'You cannot add a comment to this request.'
      });
  } catch (error) { next(error); }
};
