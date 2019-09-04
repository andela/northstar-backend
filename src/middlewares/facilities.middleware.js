import FacilityUtils from '../utils/facility.utils';

const { getFacilitiesDetails } = FacilityUtils;

/**
* @param {Object} req
* @param {Object} res
* @param {Function} next
* @returns {Function} next: the subsequent middleware in the route handler
*/
const getFacilitiesValues = (req, res, next) => {
  const facilitiesValues = getFacilitiesDetails(req.body);
  const isEmpty = Object.keys(facilitiesValues).length === 0;

  if (!isEmpty) {
    // make facilitiesValues available to the next middleware
    req.body.facilitiesValues = facilitiesValues;
    return next();
  }
  res.status(422).json({
    status: 'error',
    error: 'You have not entered any facilities details'
  });
};

export default getFacilitiesValues;
