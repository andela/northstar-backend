import models from '../db/models';
import Response from './response.utils';

const { Comment, Request } = models;

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

  /**
   * @param {string} requestId the id of the travel request
   * @returns {string} the id of the owner of the request
   */
  static async findRequestOwnerId(requestId) {
    try {
      const result = await Request.findOne({ where: { id: requestId } });
      return result;
    } catch (error) {
      return Response.InternalServerError(res, 'error occured while looking for request owner');
    }
  }
}
