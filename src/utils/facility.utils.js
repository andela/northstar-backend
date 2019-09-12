import sequelize from 'sequelize';

const { Op } = sequelize;

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

  /**
   * Builds the query object that fetches an existing booking for an
   * accomodation that conflicts with the present booking being sought
   * @param {number} room_id
   * @param {string} departure_date
   * @param {string} return_date
   * @returns {object} formatted query object
   */
  static getConflictingBookingQuery(room_id, departure_date, return_date) {
    return {
      // The goal is to build a query that checks if dates and intervals of a new
      // booking about to be made conflicts with an existing booking's for same room
      where: {
        room_id,
        [Op.and]: {
          [Op.or]: [sequelize.literal(`'${departure_date}' between departure_date and return_date`),
            sequelize.literal(`'${return_date}' between departure_date and return_date`),
            sequelize.literal(`departure_date between '${departure_date}' and '${return_date}'`),
            sequelize.literal(`return_date between '${departure_date}' and '${return_date}'`)],
        }
      }
    };
  }
}
