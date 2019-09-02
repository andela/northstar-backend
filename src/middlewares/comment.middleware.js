
import Response from '../utils/response.utils';
import CommentUtils from '../utils/comment.util';

/**
 * Middleware for the comment routes
 */
export default class AuthenticationMiddleware {
  /**
     * Handles deletion of comment
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
      if (commentOwner !== userId) return Response.UnauthorizedError(res, 'You are not unauthorized to delete this comment');
      next();
    } catch (error) {
      return Response.InternalServerError(res, 'Error validating comment owner');
    }
  }
}
