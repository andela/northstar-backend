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

  /**
 * get comments associated with a travel request
 * @param {ServerRequest} req
 * @param {ServerResponse} res
 * @returns {ServerResponse} response
 */
  static async getComments(req, res) {
    try {
      const { request_id: id } = req.params;
      const result = await Comment.findAll({ attributes: ['id', 'comment'], where: { request_id: id, delete_status: false } });
      return Response.Success(res, {
        ...result
      }, 200);
    } catch (error) {
      return Response.InternalServerError(res, 'Could not populate the comment(s)');
    }
  }
}
