import bcrypt from 'bcrypt';
import models from '../db/models';
import sender from '../services/email.service';
import Response from '../utils/response.utils';
import UserUtils from '../utils/user.utils';
import JWTService from '../services/jwt.service';

const { User } = models;

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
      const userData = UserUtils.getUserSignupData(req.body);
      const user = await User.create({
        ...userData,
        password: hash
      }, { returning: true });

      // parameter(s) to be passed to the sendgrid email template
      const payload = { user };
      await sender.sendEmail(process.env.SENDER_EMAIL, user.email, 'signup_template', payload);

      const userToken = JWTService.generateToken(user);
      return Response.Success(res, {
        id: user.id,
        ...userData,
        role: user.role,
        is_verified: user.is_verified,
        token: userToken
      }, 201);
    } catch (error) {
      return Response.InternalServerError(res, 'Could not signup user');
    }
  }

  /**
   * Handles signin requests
   * @param {ServerRequest} req
   * @param {ServerResponse} res
   * @returns {ServerResponse} response
   */
  static signin(req, res) {
    const signinError = { message: 'Incorrect email or password' };
    User.findOne({ where: { email: req.body.email } })
      .then((user) => {
        if (!user) return Response.UnauthorizedError(res, signinError);
        return UserUtils.validateUserPassword(user, req.body.password)
          .then((matches) => {
            if (!matches) return Response.UnauthorizedError(res, signinError);
            const data = UserUtils.getPublicUserFields(user.dataValues);
            data.token = JWTService.generateToken(data);
            return Response.Success(res, data);
          });
      })
      .catch(() => Response.UnauthorizedError(res, signinError));
  }
}
