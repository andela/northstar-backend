import models from '../db/models';
import Response from '../utils/response.utils';
import sender from '../services/email.service';
import logger from '../logs/winston';

const { Notification, User } = models;

/**
 * This class creates the comment controller
 */
export default class NotificationController {
/**
 * Handles creating of new notification
 * @param {object} notificationData the data for notification
 * @param {object} payload the payload of the email to be sent
 * @returns {boolean} true
 */
  static async createNotification(notificationData, payload) {
    try {
      await Notification.create({
        ...notificationData
      }, { returning: true });
      const notificationStatus = await NotificationController
        .checkNotificationStatus(notificationData.receiver_id);
      if (notificationStatus) await sender.sendEmail(process.env.SENDER_EMAIL, payload.manager_email, 'travel_request_notification', payload);
      return true;
    } catch (error) {
      logger.error(error);
    }
  }

  /**
   * @param {string} userId The notification details
   * @returns {boolean} true or false
   */
  static async checkNotificationStatus(userId) {
    try {
      const { email_notification } = await User.findOne({ where: { id: userId } });
      return email_notification;
    } catch (error) {
      logger.error(error);
    }
  }

  /**
 * Handles getting a manager's notification
 * @param {ServerRequest} req
 * @param {ServerResponse} res
 * @returns {ServerResponse} response
 */
  static async getNotifications(req, res) {
    try {
      const result = await Notification.findAll({ attributes: ['id', 'subject', 'notification', 'request_id'], where: { receiver_id: req.body.user_id, read: false } });
      return Response.Success(res, result, 200);
    } catch (error) {
      return Response.InternalServerError(res, 'Could not populate notifications');
    }
  }
}
