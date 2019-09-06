import helpers from '../utils/helpers.utils';
import numberRegex from '../utils/regexen.utils';

const { checkForEmptyFields, checkPatternedFields, fieldNotNeeded } = helpers;

export default {
  Requests: (req, res, next) => {
    const errors = [];
    const {
      category, origin, destination, departure_date, return_date, reason, booking_id
    } = req.body;

    if (category.toLowerCase().trim() === 'one-way') {
      if (return_date) {
        errors.push(...fieldNotNeeded('Return date', departure_date));
      }
      errors.push(...checkForEmptyFields('Origin', origin));
      errors.push(...checkForEmptyFields('Destination', destination));
      errors.push(...checkForEmptyFields('Departure date', departure_date));
      errors.push(...checkForEmptyFields('Reason', reason));
      errors.push(...checkPatternedFields('Booking ID', booking_id, numberRegex));
    } else {
      return res.status(400).json({
        status: 'error',
        error: {
          message: 'Ensure category is set to one-way.'
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
