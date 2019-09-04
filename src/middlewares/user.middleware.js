import { check, validationResult } from 'express-validator';
// import passport from 'passport';

import Responses from '../utils/response.utils';
// import JWTService from '../services/jwt.service';

const signinError = { message: 'Incorrect email or password' };

/**
 * Middleware for the auth routes
 */
export default class AuthenticationMiddleware {
  /**
   * Defines the validation checks for the signin request body
   * and a middleware function for handling validation errors
   * @returns {Array} of checks and validation function
   */
  static validateSigninFields() {
    return [
      [
        check('email').exists().isEmail(),
        check('password').exists().isLength({ min: 8 })
      ],
      (req, res, next) => {
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) return Responses.UnauthorizedError(res, signinError);
        next();
      }
    ];
  }

  /**
   * Ensure the the user is a super admin
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next | calls the next middleware in the middleware chain
   * @returns {Function} next
   */
  static isSuperAdmin(req, res, next) {
    const { role } = req.body.user;
    return role === 'super_admin'
      ? next()
      : res.status(403).json({
        status: 'error',
        error: 'You do not have permission for this action.'
      });
  }
}
