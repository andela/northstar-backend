import FacilityUtils from '../utils/facility.utils';
import models from '../db/models';

const { Facility } = models;
const { getFacilitiesDetails } = FacilityUtils;
const { getRoomsDetails } = FacilityUtils;

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
  }
};

export default FacilitiesChecks;
