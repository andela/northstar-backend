import sequelize from 'sequelize';

import models from '../db/models';

const { Op } = sequelize;
const { User } = models;
const statuses = ['pending', 'approved', 'declined'];
const categories = ['one-way', 'round-trip', 'multi-city'];


/**
   * Validates if the request's ENUM properties exist on the query object,
   * validates their values, attach and appropriate query format or throws
   * and error else
   * @param {object} fields with properties status and category destructured
   * @param {object} preparedQuery
   * @param {object} errors
   * @returns {undefined}
   */
const validateAndPopulateEnumFields = ({ status, category }, preparedQuery, errors) => {
  if (status) {
    if (statuses.includes(status)) preparedQuery.where.status = status;
    else {
      errors.status = 'Invalid request status value. Please choose one of "pending", "approved", and "declined"';
    }
  }
  if (category) {
    if (categories.includes(category)) preparedQuery.where.category = category;
    else {
      errors.category = 'Invalid request category value. Please choose one of "one-way", "round-trip", and "multi-city"';
    }
  }
};


/**
 * Defines utility functions for operations involving travel requests
 */
export default class RequestUtils {
  /**
   * Populates @param preparedQuery with sequelize queries, in a format ready to
   * be passed into a sequelize.Model.findAll method call
   *
   * For each existing useful query parameter, format a sequelize query (using sequelize operators
   * or mere equality as applicable to the data type) for it and attach to @param preparedQuery
   * @param {object} request.body (Request body) destructured into user_id and role
   * @param {object} errors
   * @param {object} preparedQuery
   * @param {object} fields
   * @returns {object} preparedQuery
   */
  static populateQueryObject({ user_id, role }, preparedQuery, fields, errors) {
    if (fields.duration) {
      preparedQuery.where = {
        [Op.and]: [sequelize.literal(`return_date - departure_date=${fields.duration.match(/^\d+/)[0]}`)]
      };
    }
    preparedQuery.include = [{ model: User, where: { }, attributes: [] }];
    if (role !== 'manager' && role !== 'super_admin') {
      // Retrieve only requests belonging to the user if s/he is not a manager nor super admin
      preparedQuery.include[0].where.id = user_id;
    } else {
      // For a super admin or manager querying using the owner email
      if (fields.owner) { preparedQuery.include[0].where.email = { [Op.iLike]: `%${fields.owner}%` }; }
      // Fetch only a manager's surbodinates requests
      if (role === 'manager') preparedQuery.include[0].where.manager_id = user_id;
    }
    if (fields.destination) {
      preparedQuery.where.destination = { [Op.contains]: [fields.destination] };
    }
    if (fields.origin) preparedQuery.where.origin = { [Op.iLike]: `%${fields.origin}%` };
    if (fields.request_id) preparedQuery.where.id = fields.request_id;
    if (fields.start_date) preparedQuery.where.departure_date = fields.start_date;
    // Validate database ENUM fields have only values specified when they exist on query
    validateAndPopulateEnumFields(fields, preparedQuery, errors);
  }

  /**
   * Retrieves updatable request fields
   * @param {Object} reqBody: http request body
   * @return {Object} Request object to update
   */
  static getValuesToUpdate(reqBody) {
    // a list of all the profile details a user is allowed to update
    const permittedValues = [
      'origin',
      'destination',
      'category',
      'departure_date',
      'return_date',
      'reason'
    ];
    const valuesToUpdate = {};

    permittedValues.forEach((key) => {
      // remove fields that user did not specify
      if (reqBody[key]) valuesToUpdate[key] = reqBody[key];
    });
    return valuesToUpdate;
  }
}
