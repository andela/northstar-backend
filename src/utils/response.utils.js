/**
 * Defines reusable responses
 */
export default class {
  /**
   * Defines the specification for the "unauthorized error" response cases
   * @param {ServerResponse} res
   * @param {object} error
   * @param {number} code
   * @returns {ServerResponse} response
   */
  static UnauthorizedError(res, error, code) {
    return res.status(code || 401).json({
      status: 'error',
      error
    });
  }

  /**
   * Defines the specification for the "success" response cases
   * @param {ServerResponse} res
   * @param {object} data
   * @param {number} code
   * @returns {ServerResponse} response
   */
  static Success(res, data, code) {
    return res.status(code || 200).json({
      status: 'success',
      data
    });
  }

  /**
   * @param {ServerResponse} res
   * @param {object|string} error
   * @returns {ServerResponse} response
   */
  static InternalServerError(res, error) {
    return res.status(500).json({
      status: 'error',
      error
    });
  }
}
