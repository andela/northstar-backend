/**
 * Defines reusable responses
 */
export default class {
  /**
   * Defines the specification for the "unauthorized error" response cases
   * @param {Object} res
   * @param {Object} error
   * @param {number} code
   * @returns {Object} response
   */
  static UnauthorizedError(res, error, code) {
    return res.status(code || 401).json({
      status: 'error',
      error
    });
  }

  /**
   * Defines the specification for the "success" response cases
   * @param {Object} res
   * @param {Object} data
   * @param {number} code
   * @returns {ServerResponse} response
   */
  static Success(res, data, code = 200) {
    return res.status(code).json({
      status: 'success',
      data
    });
  }

  /**
   * @param {Object} res
   * @param {Object|string} error
   * @returns {Object} response
   */
  static InternalServerError(res, error) {
    return res.status(500).json({
      status: 'error',
      error
    });
  }

  /**
   * Defines the specification for the "custom" response cases
   * @param {Object} res
   * @param {number} code
   * @param {string} status
   * @param {string} message
   * @param {string} information
   * @returns {Object} response
   */
  static CustomError(res, code, status, message, information = 0) {
    return res.status(code).json({
      status,
      error: {
        message,
        information
      }
    });
  }
}
