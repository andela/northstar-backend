import models from '../db/models';
import RequestUtils from '../utils/request.utils';
import Response from '../utils/response.utils';

const { Request } = models;

// Search: request ID, owner, destination, origin, duration, start date, request status
const expectedFields = ['request_id', 'owner', 'destination', 'origin',
  'duration', 'start_date', 'status', 'category'];
const durationError = 'Invalid duration value. Please ensure it is a whole '
  + 'number (note: it is assumed to be in days).';

/**
 * Defines middleware for the /requests routes
 */
export default class RequestMiddleware {
  /**
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns {undefined}
   */
  static async validateRequests(req, res, next) {
    const request = await Request.count({ where: { id: req.params.id } });
    if (request < 1) {
      return res.status(404).json({
        status: 'error',
        error: 'This request does not exist'
      });
    }
    return next();
  }

  /**
   * Prepares search query parameters on the Request object of a
   * GET /requests request
   * @param {object} req (Request object)
   * @param {object} res (ServerResponse object)
   * @param {function} next
   * @returns {undefined|function} undefined or next
   */
  static prepareRequestQuery(req, res, next) {
    if (!Object.keys(req.query).length) return next(); // No query
    const fields = {}, errors = {};
    // Filter and attach to "fields" only useful properties
    expectedFields.forEach((el) => {
      if (req.query[el]) fields[el] = req.query[el].trim().toLowerCase();
    });
    // If no useful property made it, return a bad request error
    if (!Object.keys(fields).length) return Response.BadRequestError(res, { message: 'Invalid query parameter(s)' });
    // Declare an object with a 'where' property
    const preparedQuery = { where: { } };
    try {
      // populate object 'preparedQuery' with sequelize formatted queries
      RequestUtils.populateQueryObject(req.body, preparedQuery, fields, errors);
    } catch (err) {
      errors.duration = durationError;
    }
    // Return error if any otherwise attach the formatted query to request object
    // and proceed to controller
    if (Object.keys(errors).length) return Response.BadRequestError(res, errors);
    req.query = preparedQuery;
    next();
  }

  static async checkRequestStatus(req, res, next) {
    const existingRequest = await Request.findByPk(req.params.request_id);

    if (!existingRequest) {
      return res.status(404).json({
        status: 'error',
        error: 'Request not found'
      });
    }

    const isOwner = (existingRequest.user_id === req.body.user_id);

    if (!isOwner) {
      return res.status(403).json({
        status: 'error',
        error: ' You cannot edit this request'
      });
    }

    if (!(existingRequest.status === 'pending')) {
      return res.status(400).json({
        status: 'error',
        error: 'You cannot update a request that is not pending'
      });
    }

    req.existingRequest = existingRequest;

    return next();
  }
};
