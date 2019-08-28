import jwt from 'jsonwebtoken';

/**
 * Defines functions interfacing with the 'jsonwebtoken' library
 */
export default class JWTService {
  /**
   * Generates a new token for a particular user
   * @param {string} email
   * @returns {string} token
   */
  static generateToken({ id, role }) {
    return jwt.sign({ id, role },
      process.env.JWT_SECRET, { expiresIn: '7d' });
  }
}
