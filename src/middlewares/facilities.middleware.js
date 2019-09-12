import FacilityUtils from '../utils/facility.utils';
import Response from '../utils/response.utils';
import HelperUtils from '../utils/helpers.utils';

const { getFacilitiesDetails } = FacilityUtils;
const { getRoomsDetails } = FacilityUtils;
const dateIntervalError = 'The return date must be ahead of the departure date';

const FacilitiesChecks = {
  async getFacilitiesValues(req, res, next) {
    const facilitiesValues = getFacilitiesDetails(req.body);
    const isEmpty = Object.keys(facilitiesValues).length === 0;

    if (!isEmpty) {
      // make facilitiesValues available to the next middleware
      req.body.facilitiesValues = facilitiesValues;
      if (typeof (facilitiesValues.images) === 'string') {
        const { images } = facilitiesValues;
        req.body.facilitiesValues = { ...facilitiesValues, images: images.split(',') };
        req.body.images = images.split(',');
      }
      return next();
    }
    res.status(422).json({
      status: 'error',
      error: 'You have not entered any facilities details'
    });
  },

  async getRoomsValues(req, res, next) {
    const roomsValues = getRoomsDetails(req.body);
    // ensures the user supplies, at least, one value to update
    const isEmpty = Object.keys(roomsValues).length === 0;

    if (!isEmpty) {
      // make userValues available to the next middleware
      req.body.roomsValues = roomsValues;
      return next();
    }
    // Return a 422 error if user does not supply values to update.
    res.status(422).json({
      status: 'error',
      error: 'You have not entered any room details'
    });
  },

  /**
   * Ensures the date fields supplied in the booking request are valid
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {undefined|object} nothing or ServerResponse object
   */
  validateBookingDates(req, res, next) {
    const errors = {};
    const { departure_date, return_date } = req.body;
    // If any invalid date value exists populate an error on "errors"
    HelperUtils.validateDatesFieldFormat({ departure_date, return_date }, errors);
    // If departure date is same as or ahead of return date populate an error on "errors"
    if ((new Date(return_date) - new Date(departure_date)) <= 0) {
      errors.intervalError = dateIntervalError;
    }
    // If departure date is lesser than today populate an error on "errors"
    const today = new Date().toISOString().split('T')[0];
    if ((new Date(departure_date) - new Date(today)) < 0) {
      errors.departureDateError = 'Departure date cannot be lesser than today';
    }
    // If any error has occured return a bad request error, else proceed to the controller
    if (Object.keys(errors).length) return Response.BadRequestError(res, errors);

    next();
  }
};

export default FacilitiesChecks;
