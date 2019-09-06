
import Response from '../utils/response.utils';
import CommentUtils from '../utils/comment.util';

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
}
