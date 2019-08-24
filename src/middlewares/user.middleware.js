import { check, validationResult } from 'express-validator';
// import passport from 'passport';

import Responses from '../utils/response.utils';
import JWTService from '../services/jwt.service';

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
}
