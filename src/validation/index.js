import helpers from '../utils/helpers.utils';
import numberRegex from '../utils/regexen.utils';

const {
  checkForEmptyFields, checkPatternedFields, fieldNotNeeded, trimValues
} = helpers;

export default {
  Requests: (req, res, next) => {
    const errors = [];
    const requestBody = trimValues(req.body);
    const {
      category, origin, destination, departure_date, return_date, reason, booking_id
    } = requestBody;

    if (category.toLowerCase().trim() === 'one-way') {
      if (return_date) {
        errors.push(...fieldNotNeeded('Return date', departure_date));
      }
      errors.push(...checkForEmptyFields('Origin', origin));
      errors.push(...checkForEmptyFields('Destination', destination));
      errors.push(...checkForEmptyFields('Departure date', departure_date));
      errors.push(...checkForEmptyFields('Reason', reason));
      errors.push(...checkPatternedFields('Booking ID', booking_id, numberRegex));
    } else if (category.toLowerCase().trim() === 'round-trip') {
      errors.push(...checkForEmptyFields('Origin', origin));
      errors.push(...checkForEmptyFields('Destination', destination));
      errors.push(...checkForEmptyFields('Departure date', departure_date));
      errors.push(...checkForEmptyFields('Return date', return_date));
      errors.push(...checkForEmptyFields('Reason', reason));
      errors.push(...checkPatternedFields('Booking ID', booking_id, numberRegex));
    } else {
      return res.status(400).json({
        status: 'error',
        error: {
          message: 'Ensure category is set to one of [one-way, round-trip].'
        },
      });
    }

    if (errors.length) {
      return res.status(400).json({
        status: 'error',
        error: errors,
      });
    }

    return next();
  },

  facilityID: (req, res, next) => {
    const errors = [];
    const { id } = req.params;

    errors.push(...checkPatternedFields('Facility ID', id, numberRegex));

    if (errors.length) {
      return res.status(400).json({
        status: 'error',
        error: errors,
      });
    }

    return next();
  },
};
