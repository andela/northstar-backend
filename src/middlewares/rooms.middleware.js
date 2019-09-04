import FacilityUtils from '../utils/facility.utils';

const { getRoomsDetails } = FacilityUtils;

/**
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
* @returns {Function} next: the subsequent middleware in the route handler
*/
const getRoomsValues = (req, res, next) => {
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
};

export default getRoomsValues;
