import models from '../db/models';
import Response from '../utils/response.utils';

const { Comment } = models;

/**
 * This class creates the comment controller
 */
export default class CommentController {
/**
 * Handles deletion of comment
 * @param {ServerRequest} req
 * @param {ServerResponse} res
 * @returns {ServerResponse} response
 */
  static async deleteComment(req, res) {
    try {
      const { comment_id } = req.params;
      await Comment.update(
        { delete_status: true },
        { where: { id: comment_id } }
      );
      return Response.Success(res, {
        message: 'comment deleted successfully'
      }, 200);
    } catch (error) {
      return Response.InternalServerError(res, 'Could not delete comment');
    }
  }
}
