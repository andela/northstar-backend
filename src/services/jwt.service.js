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
  static generateToken({ id, role, email }) {
    return jwt.sign({ id, role, email },
      process.env.JWT_SECRET, { expiresIn: '7d' });
  }

  /**
   * Generates a new token for a particular user
   * @param {string} data
   * @returns {string} token
   */
  static generatePasswordToken(data) {
    return jwt.sign({ id: data.id, role: data.role },
      process.env.JWT_SECRET, { expiresIn: '1h' });
  }
}
