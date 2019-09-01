import models from '../db/models';
import sender from '../services/email.service';

const { Request, User } = models;
/**
 * This class creates the user controller
 */
export default class UserController {
  /**
   * @param {object} req The user's signup details
   * @param {object} res The user's details returned after signup
   * @returns {object} A signed up user
   */
  static async rejectRequest(req, res) {
    try {
      const request = await Request.update(
        {
          status: 'declined'
        }, { returning: true, where: { id: req.params.id } }
      );
      const requestResult = request[1][0];

      const user = await User.findOne({ where: { id: requestResult.user_id } });
      const { first_name: firstName, email } = user;

      // parameter(s) to be passed to the sendgrid email template
      await sender.sendEmail(process.env.SENDER_EMAIL, email, 'request_rejected', { firstName, email });
      return res.status(201).json({
        status: 'success',
        data: requestResult
      });
    } catch (error) {
      return res.status(500)
        .json({
          status: 'error',
          error: 'Error accessing the request route',
        });
    }
  }
}
