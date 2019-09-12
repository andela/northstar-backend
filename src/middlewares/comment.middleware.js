import models from '../db/models/index';
import Response from '../utils/response.utils';
import CommentUtils from '../utils/comment.util';

const { Request, User } = models;
/**
 * Middleware for the comment routes
 */
export default class AuthenticationMiddleware {
  /**
     * Checks the comment owner
     * @param {object} req The server request
     * @param {object} res  The server response
     * @param {NextMatchingRoute} next
     * @returns {nextRoute} response
     */
  static async verifyCommentOwner(req, res, next) {
    try {
      const { comment_id } = req.params;
      const { id: commentOwner } = await CommentUtils.findCommentOwnerId(comment_id);
      const { id: userId } = req.tokenData;
      if (commentOwner !== userId) return Response.UnauthorizedError(res, 'You are not authorized to delete this comment');
      next();
    } catch (error) {
      return Response.InternalServerError(res, 'Error validating comment owner');
    }
  }

  /**
     * Checks whether the person is either a request owner or a manager/super admin
     * @param {object} req The server request
     * @param {object} res  The server response
     * @param {NextMatchingRoute} next
     * @returns {nextRoute} response
     */
  static async verifyPermission(req, res, next) {
    try {
      const { request_id } = req.params;
      const { id: requestOwner } = await CommentUtils.findRequestOwnerId(request_id);
      const { id: userId, role } = req.tokenData;
      if (requestOwner !== userId && role !== 'super_admin' && role !== 'manager') return Response.UnauthorizedError(res, 'You are not authorized to view this comment(s)');
      next();
    } catch (error) {
      return Response.InternalServerError(res, 'Error checking permission');
    }
  }

  /**
   * Ensures a user is the owner of the request or the request owner's manager
   * @param {Object} req
   * @param {Object} res
   * @param {Callback} next | next middleware in the chain
   * @returns {Function} next | next middleware in the chain
   */
  static async ensureUserCanPost(req, res, next) {
    const { request_id, user } = req.body;

    try {
      const request = await Request.findByPk(request_id, {
        include: [{ model: User }]
      });

      // send a 404 error if request does not exist
      if (!request) {
        return res.status(404).json({
          status: 'error',
          error: 'Request not found.'
        });
      }

      // permit if user owns the request or is the manager of the request owner
      const isPermitted = (user.id === request.user_id)
                            || (user.id === request.User.manager_id);

      // make request available to the next middleware
      req.body.requestData = request;

      return isPermitted
        ? next()
        : res.status(403).json({
          status: 'error',
          error: 'You cannot add a comment to this request.'
        });
    } catch (error) { next(error); }
  }
}
