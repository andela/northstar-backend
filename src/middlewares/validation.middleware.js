import { validationResult, matchedData } from 'express-validator';
import Response from '../utils/response.utils';

/**
 * @class ValidationMiddleware
 */
export default class ValidationMiddleware {
  // eslint-disable-next-line valid-jsdoc
  /**
   * Defines a middleware function for handling validation errors
   *
   * @returns {Array} of checks and validation function
   */
  static validate(schema) {
    const validationCheck = (req, res, next) => {
      const errors = validationResult(req);
      req = { ...req, ...matchedData(req) };

      if (!errors.isEmpty()) {
        const mappedErrors = Object.entries(errors.mapped()).reduce((acc, [key, value]) => {
          acc[key] = value.msg;
          return acc;
        }, {});

        return Response.ValidationError(res, mappedErrors);
      }

      return next();
    };

    return [...(schema.length && [schema]), validationCheck];
  }
}
