import model from '../db/models/index';

const { Notification } = model;

/**
 * Notifications middleware
 */
export default class NotificationMiddleware {
  /**
     * sends notification to user when a comment is made on a request
     * @param {Object} req
     * @param {Object} res
     * @returns {JSON} responseBody
     */
  static async postCommentNotification(req, res) {
    // requestData and commentData were gotten from the ensureUserCanPost and postComment middlewares respectively
    const { requestData, user, commentData } = req.body;

    try {
      // send notification to User's manager if user owns the request
      const responseMessage = (user.id === requestData.user_id)
        ? 'A notification was sent to your manager.'
        : 'A notification was sent to the request\'s owner.';

      const receiver_id = (user.id === requestData.user_id)
        ? requestData.User.manager_id
        : requestData.user_id;

      await Notification.create({
        request_id: requestData.id,
        subject: 'New Comment On Request',
        notification: commentData.comment,
        receiver_id
      });

      await res.status(201).json({
        status: 'success',
        data: commentData,
        message: responseMessage
      });
    } catch (error) {
      // sending a 201 status because although notification failed, comment was successfully posted
      res.status(201).json({
        status: 'success',
        data: commentData,
        message: 'Could not send notification.'
      });
    }
  }
}
