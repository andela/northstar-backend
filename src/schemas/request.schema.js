import { check } from 'express-validator';
import isISO8601 from 'validator/lib/isISO8601';
import isAfter from 'validator/lib/isAfter';

import isNotEmpty from '../utils/isNotEmpty.utils';
import isBeforeDate from '../utils/isBeforeDate.utils';
import isValidArray from '../utils/isValidArray.utils';
import extractDate from '../utils/extractDate.utils';
import toArray from '../utils/toArray.utils';
import constants from '../constants';


const { ONE_WAY, ROUND_TRIP, MULTI_CITY } = constants;

export default {
  requestSchema: [
    check('category')
      .optional()
      .trim()
      .custom((value) => isNotEmpty(value, 'Category cannot be left blank'))
      .isIn([ONE_WAY, ROUND_TRIP, MULTI_CITY])
      .withMessage('Category should be one of one-way, round-trip, or multi-city'),
    check('origin')
      .optional()
      .trim()
      .custom((value) => isNotEmpty(value, 'Origin cannot be left blank'))
      .isLength({ min: 2, max: 30 })
      .withMessage('Origin should be between 2 to 30 characters')
      .isAlpha()
      .withMessage('Origin should only contain alphabets')
      .customSanitizer((origin) => origin.toLowerCase()),
    check('destination')
      .optional()
      // .toArray()
      .customSanitizer((value) => toArray(value))
      .custom((value) => isValidArray(value, 'Destination should be an array of destination locations'))
      .custom((value, { req }) => {
        const category = req.body.category || req.existingRequest.category;

        if (category === ONE_WAY && value.length > 1) {
          throw new Error('One way trips can only have one destination');
        }

        return true;
      }),
    check('departure_date')
      .optional()
      .trim()
      .custom((value) => isNotEmpty(value, 'Departure date cannot be left blank'))
      .isISO8601()
      .withMessage('Departure date must be in the format YYYY-MM-DD')
      .isAfter()
      .withMessage('Departure date must be a date after today')
      .custom((value, { req }) => {
        const return_date = req.body.return_date || req.existingRequest.return_date;

        if (!return_date) {
          return true;
        }

        return isBeforeDate(
          value, req.body.return_date || extractDate(req.existingRequest.return_date), 'Departure date must be before return date'
        );
      }),
    check('return_date')
      .trim()
      .custom((value, { req }) => {
        const category = req.body.category || req.existingRequest.category;
        if (category === ONE_WAY && value) {
          throw new Error('Return date is not required for one-way trips');
        } else {
          if (value && !isISO8601(value)) {
            throw new Error('Return date must be in the format YYYY-MM-DD');
          }

          if (value && !isAfter(value)) {
            throw new Error('Return date must be a date after today');
          }

          if (value && !isAfter(
            value, req.body.departure_date || extractDate(req.existingRequest.departure_date)
          )) {
            throw new Error('Return date must be after departure date');
          }

          if (!value && req.existingRequest.category === ONE_WAY && req.body.category !== ONE_WAY) {
            throw new Error(`Return date is required for ${req.body.category} trips`);
          }
        }

        return true;
      }),
    check('reason')
      .optional()
      .trim()
      .custom((value) => isNotEmpty(value, 'Reason cannot be left blank')),
  ]
};
