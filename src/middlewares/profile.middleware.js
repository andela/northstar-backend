import UserUtils from '../utils/user.utils';

const { getValuesToUpdate } = UserUtils;

/**
*
* @param {Object} req
* @param {Object} res
* @param {Function} next
* @returns {Function} next: the subsequent middleware in the route handler
*/
const getProfileUpdateValues = (req, res, next) => {
// TODO: Add test for this middleware
// this obtains the details (all of which are optional) the user wishes to update
  const userValues = getValuesToUpdate(req.body);
  // ensures the user supplies, at least, one value to update
  const isEmpty = Object.keys(userValues).length === 0;

  if (!isEmpty) {
    // make userValues available to the next middleware
    req.body.userValues = userValues;
    return next();
  }
  // Return a 422 error if user does not supply values to update.
  res.status(422).json({
    status: 'error',
    error: 'Supply values to update.'
  });
};

export default getProfileUpdateValues;
