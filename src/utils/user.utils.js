// import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
// import models from '../db/models';

// const { User } = models;

/**
 * Defines helper functions for the user model
 */
export default class UserUtils {
  /**
   * @param {object} user
   * @param {string} password
   * @returns {Promise} that resolves password validation
   */
  static validateUserPassword(user, password) {
    return bcrypt.compare(password, user.password);
  }

  /**
   * Filters out properties (password) that shouldn't go public
   * @param {object} user
   * @returns {object} data
   */
  static getPublicUserFields(user) {
    const data = {};
    Object.entries(user).forEach(([key, value]) => {
      if (key !== 'password') {
        data[key] = value;
      }
    });
    return data;
  }

  /**
   * Retrieves necessary signup data from request body
   * @param {ServerRequest.body} reqObj
   * @returns {object} data
   */
  static getUserSignupData(reqObj) {
    return {
      first_name: reqObj.first_name,
      last_name: reqObj.last_name,
      email: reqObj.email,
      gender: reqObj.gender,
      birth_date: reqObj.birth_date,
      preferred_language: reqObj.preferred_language,
      preferred_currency: reqObj.preferred_currency,
      location: reqObj.location
    };
  }


  /**
   * Gets the public fields of a user
   * @param {Object} userObj
   * @returns {Object} public fields
   */
  static returnRoleUpdateData(userObj) {
    return {
      first_name: userObj.first_name,
      last_name: userObj.last_name,
      email: userObj.email,
      gender: userObj.gender,
      birth_date: userObj.birth_date,
      preferred_language: userObj.preferred_language,
      preferred_currency: userObj.preferred_currency,
      location: userObj.location,
      role: userObj.role
    };
  }
}
