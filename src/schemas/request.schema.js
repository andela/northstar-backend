import { check } from 'express-validator';
import isNotEmpty from '../utils/isNotEmpty';
// import isStringArray from '../utils/isStringArray';
import isBeforeDate from '../utils/isBeforeDate';
import isAfterDate from '../utils/isAfterDate';
import isValidArray from '../utils/isValidArray';

export default {
  requestSchema: [
    check('category')
      .optional()
      .trim()
      .exists()
      .withMessage('Category is required')
      .custom((value) => isNotEmpty(value, 'Category cannot be left blank'))
      .isIn(['one-way', 'round-trip', 'multi-city'])
      .withMessage('Category should be one of one-way, round-trip, or multi-city'),
    check('origin')
      .optional()
      .trim()
      .exists()
      .withMessage('Origin is required')
      .custom((value) => isNotEmpty(value, 'Origin cannot be left blank'))
      .isLength({ min: 2, max: 30 })
      .withMessage('Origin should be between 2 to 30 characters')
      .isAlpha()
      .withMessage('Origin should only contain alphabets')
      .customSanitizer((origin) => origin.toLowerCase()),
    check('destination')
      .optional()
      .exists()
      .withMessage('Destination is required')
      .isArray()
      .withMessage('Destination should be an array of destination locations')
      .custom((value) => isValidArray(value, 'Destination should be an array of destination locations')),
    check('departure_date')
      .optional()
      .trim()
      .exists()
      .withMessage('Departure date is required')
      .custom((value) => isNotEmpty(value, 'Departure date cannot be left blank'))
      .isISO8601()
      .withMessage('Departure date must be in the format YYYY-MM-DD')
      .isAfter()
      .withMessage('Departure date must be a date after today')
      .custom((value, { req }) => isBeforeDate(value, req.body.return_date, 'Departure date must be before return date')),
    check('return_date')
      .optional()
      .trim()
      .exists()
      .withMessage('Return date is required')
      .custom((value) => isNotEmpty(value, 'Return date cannot be left blank'))
      .isISO8601()
      .withMessage('Return date must be in the format YYYY-MM-DD')
      .isAfter()
      .withMessage('Return date must be a date after today')
      .custom((value, { req }) => isAfterDate(value, req.body.departure_date, 'Return date must be after departure date')),
    check('reason')
      .optional()
      .trim()
      .custom((value) => isNotEmpty(value, 'Reason cannot be left blank')),
  ]
};
