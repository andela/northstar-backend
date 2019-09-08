/**
 * Trims every incoming string
 * @param {Object} req
 * @param {Object} res
 * @param {Callback} next
 * @returns {Callback} next middleware in the middleware chain.
 */
const bodySanitizer = (req, res, next) => {
  const stringKeys = Object.keys(req.body);
  stringKeys.forEach((key) => {
    if (typeof (req.body[key]) === 'string') {
      req.body[key] = req.body[key].trim();
    }
  });
  return next();
};

export default bodySanitizer;
