import models from '../db/models';
import Response from './response.utils';

const { Comment } = models;

/**
 * Defines helper functions for the comment class
 */
export default class CommentUtils {
  /**
   * @param {string} commentId the id of the comment
   * @returns {string} the id of the owner of the comment
   */
  static async findCommentOwnerId(commentId) {
    try {
      const result = await Comment.findOne({ where: { id: commentId } });
      return result;
    } catch (error) {
      return Response.InternalServerError(res, 'error occured while looking for comment owner');
    }
  }
}
