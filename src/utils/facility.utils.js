/**
 * Defines helper functions for the facility model
 */
export default class FacilityUtils {
  /**
   * Set the facilities fields to be created here
   * @param {Object} reqBody: http request body
   * @return {Object} Facility object to create
   */
  static getFacilitiesDetails(reqBody) {
    // a list of all the facilities details to be created
    const facilitiesValues = [
      'name',
      'street',
      'city',
      'country',
      'address',
      'number_of_rooms',
      'available_space',
      'images',
      'description'
    ];
    const valuesToPost = {};

    facilitiesValues.forEach((key) => {
      // remove fields that were not specified
      if (reqBody[key]) valuesToPost[key] = reqBody[key];
    });
    return valuesToPost;
  }

  /**
   * Set the room fields to be created here
   * @param {Object} reqBody: http request body
   * @return {Object} Room object to create
   */
  static getRoomsDetails(reqBody) {
    // a list of all the room details to be created
    const roomsValues = [
      'name',
      'type',
      'price',
      'facility_id',
      'images'
    ];
    const valuesToPost = {};

    roomsValues.forEach((key) => {
      // remove fields that were not specified
      if (reqBody[key]) valuesToPost[key] = reqBody[key];
    });
    return valuesToPost;
  }
}
