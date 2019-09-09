import crypto from 'crypto';
import bcrypt from 'bcrypt';
import models from '../db/models';
import sender from '../services/email.service';
import Response from '../utils/response.utils';
import UserUtils from '../utils/user.utils';
import JWTService from '../services/jwt.service';
import auth from '../middlewares/auth';

const { User } = models;
const defaultPassword = crypto.createHash('sha1').update(Math.random().toString()).digest('hex');

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
    const userData = UserUtils.getUserSignupData(req.body);

    try {
      const hash = await bcrypt.hash(req.body.password, 10);
      const user = await User.create({
        ...userData,
        password: hash
      }, { returning: true });

      // parameter(s) to be passed to the sendgrid email template
      const userToken = JWTService.generateToken(user);
      const payload = {
        user,
        url: `${process.env.VERIFICATION_ROUTE}${userToken}`
      };
      await sender.sendEmail(process.env.SENDER_EMAIL, user.email, 'signup_template', payload);

      UserUtils.setCookie(res, userToken);

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
   * @param {object} req The user's ID
   * @param {object} res The user's details returned after verification
   * @returns {object} A verified user
   */
  static async verifyUser(req, res) {
    try {
      const decoded = auth.verifyToken(req.params.userToken);
      const verified = await User.update(
        {
          is_verified: true
        },
        {
          returning: true,
          where: { id: decoded.payload.id }
        }
      );
      const verificationResult = verified[1][0];
      return res.status(200).json({
        status: 'success',
        data: verificationResult
      });
    } catch (error) {
      return res.status(500)
        .json({
          status: 'error',
          error: 'Error verifying user',
        });
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
        if (!user) throw new Error();
        return UserUtils.validateUserPassword(user, req.body.password)
          .then((matches) => {
            if (!matches) throw new Error();
            const data = UserUtils.getPublicUserFields(user.dataValues);
            data.token = JWTService.generateToken(data);
            UserUtils.setCookie(res, data.token);
            return Response.Success(res, data);
          });
      })
      .catch(() => Response.UnauthorizedError(res, signinError));
  }

  /**
   * @param {Object} req The request object
   * @param {Object} res The response object
   * @param {Function} next a callback function
   * @returns {JSON} updatedUser The updates user
   */
  static async updateProfile(req, res, next) {
    // userValues and id were appended to the req.body by the preceding middlewares
    const { userValues, user } = req.body;
    try {
      const updatedUser = await User.update(
        userValues,
        {
          where: { id: user.id },
          returning: true
        }
      );

      res.status(200).json({
        status: 'success',
        data: updatedUser[1][0]
      });
    } catch (error) { next(error); }
  }

  /**
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   * @returns {JSON} res
   */
  static async setUserRole(req, res, next) {
    try {
      const { role, email } = req.body;
      const updatedUser = await User.update(
        { role },
        {
          where: { email },
          returning: true
        }
      );

      if (!updatedUser[1][0]) {
        return res.status(404).json({
          status: 'error',
          error: 'User not found.'
        });
      }
      const userObject = UserUtils.returnRoleUpdateData(updatedUser[1][0]);

      return res.status(200).json({
        status: 'success',
        data: userObject
      });
    } catch (error) { next(error); }
  }

  /**
   * Handles social authentication
   * @param {*} req
   * @param {*} res
   * @returns {*} response
   */
  static async oauthSignin(req, res) {
    try {
      const { _json: details } = req.user;
      const first_name = details.first_name || details.given_name;
      const last_name = details.last_name || details.family_name;
      const { email } = details;
      const [{ dataValues: user }, created] = await User.findOrCreate({
        where: { email },
        defaults: {
          email, first_name, last_name, password: defaultPassword
        }
      });
      const payload = { first_name: user.first_name, email: user.email };
      if (created) await sender.sendEmail(process.env.SENDER_EMAIL, user.email, 'signup_template', payload);
      user.token = JWTService.generateToken(user);
      UserUtils.setCookie(res, user.token);
      const statusCode = created ? 201 : 200;
      Response.Success(res, UserUtils.getPublicUserFields(user), statusCode);
    } catch (e) {
      Response.UnauthorizedError(res, { message: 'Unable to sign in' });
    }
  }

  /**
   * get all managers
   * @param {ServerRequest} req
   * @param {ServerResponse} res
   * @returns {ServerResponse} response
   */
  static async getManagers(req, res) {
    try {
      const result = await User.findAll({ attributes: ['id', 'first_name', 'last_name', 'email', 'preferred_language', 'location'], where: { role: 'manager' } });
      return Response.Success(res, result, 200);
    } catch (error) {
      return Response.InternalServerError(res, 'Could not populate the managers(s)');
    }
  }

  /**
   * @static
   * @param {object} req
   * @param {object} res
   * @returns {json} - json
   * @memberof UserController
   */
  static async resetpasswordEmail(req, res) {
    let userToken;
    let payload;
    const userData = UserUtils.getUserSignupData(req.body);

    await User.findOne({ attributes: ['first_name', 'email', 'id'], where: { email: userData.email } })
      .then((data) => {
        payload = data;
        userToken = JWTService.generatePasswordToken(data);
      })
      .catch(() => res.status(404).json({
        status: 'error',
        message: 'user email not found',
      }));


    await User.update({
      password_reset_token: userToken
    }, { where: { email: userData.email } })
      .then(() => {
        payload.dataValues.token = userToken;
        const { first_name: firstName, email } = payload.dataValues;
        sender.sendEmail(process.env.SENDER_EMAIL, payload.dataValues.email, 'passord_reset', { firstName, email });
      })
      .then(() => {
        res.status(200).json({
          status: 'success',
          data: {
            message: 'you will receive a link in your mail shortly to proceed'
          }
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: 'error',
          message: err.message,
          info: 'password reset failed',
          err
        });
      });
  }

  /**
   * Handles auto retrieval of user's profile needed for travel
   * @param {*} req
   * @param {*} res
   * @returns {*} response
   */
  static retrieveProfile(req, res) {
    const { id: user_id } = req.body.user;

    return User.findByPk(user_id, {
      attributes: ['first_name', 'last_name', 'email',
        'manager_id', 'gender', 'birth_date', 'location']
    })
      .then((data) => {
        data.dataValues.birth_date = data.dataValues.birth_date.toString().slice(4, 15);
        Response.Success(res, data);
      })
      .catch((err) => Response.InternalServerError(res, err));
  }
}
