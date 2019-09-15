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
  static CustomError(res, code, status, message, information) {
    return res.status(code).json({
      status,
      error: {
        message,
        information
      }
    });
  }

  /**
   * Defines the specification for bad request error cases
   * @param {object} res (ServerResponse object)
   * @param {object} error
   * @param {number} code
   * @returns {object} ServerResponse
   */
  static BadRequestError(res, error, code = 400) {
    return res.status(code).json({
      status: 'error',
      error
    });
  }

  /**
   * Defines the specification for a resource not found error
   * @param {object} res (ServerResponse)
   * @param {string} message
   * @returns {object} ServerResponse
   */
  static NotFoundError(res, message) {
    return res.status(404).json({
      status: 'error',
      error: { message }
    });
  }

  /**
   * Defines the specification for conflicting resource
   * @param {object} res (ServerResponse)
   * @param {object} error
   * @returns {object} ServerResponse
   */
  static ConflictError(res, error) {
    return res.status(409).json({
      status: 'error',
      error
    });
  }

  /**
   * Defines the specification for a validation error
   * @param {object} res (ServerResponse)
   * @param {string} message
   * @returns {object} ServerResponse
   */
  static ValidationError(res, error) {
    return res.status(400).json({
      status: 'error',
      error
    });
  }
}
