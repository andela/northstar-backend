import bcrypt from 'bcrypt';
import models from '../db/models';
import token from '../services/tokenGenerator';
import sender from '../services/email';
import userSignupData from '../utils/user';

/**
 * This class creates the user controller
 */
export default class UserController {
/**
 * @param {object} req The user's signup details
 * @param {object} res The user's details returned after signup
 * @returns {object} A signed up user
 */
  static async signup(req, res) {
    try {
      const hash = await bcrypt.hash(req.body.password, 10);
      const userData = userSignupData(req.body);
      const user = await models.User.create({
        ...userData,
        password: hash
      }, { returning: true });

      // parameter(s) to be passed to the sendgrid email template
      const payload = { user };
      await sender.sendEmail(process.env.SENDER_EMAIL, user.email, 'signup_template', payload);

      const userToken = token.generateToken(user);
      return res.status(201).json({
        status: 'success',
        data: {
          id: user.id,
          ...userData,
          role: user.role,
          is_verified: user.is_verified,
          token: userToken
        }
      });
    } catch (error) {
      return res.status(500)
        .json({
          status: 'error',
          error: 'Could not signup user',
        });
    }
  }
}
