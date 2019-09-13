import models from '../db/models';
import Response from '../utils/response.utils';

const { Comment } = models;

/**
 * This class creates the comment controller
 */
export default class CommentController {
  /**
   * Handles posting of comments
   * @param {Object} req
   * @param {Object} res
   * @param {Callback} next
   * @returns {JSON} comment
   */
  static async postComment(req, res, next) {
    const { request_id, comment, user } = req.body;
    try {
      const postedComment = await Comment.create({
        request_id,
        comment,
        user_id: user.id
      });
      // sends the comment data to the notification middleware
      req.body.commentData = postedComment;
      return next(); // calls the notification middleware
    } catch (error) { next(error); }
  }

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
