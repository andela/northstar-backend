import { check, validationResult } from 'express-validator';

// this transforms the default error message
const customMessage = validationResult.withDefaults({
  formatter: (error) => (
    {
      field: error.param,
      message: error.msg
    }
  )
});

const validateRoleUpdate = [
  check('email', 'Please enter user\'s email.')
    .isEmail()
    .withMessage('Invalid email.')
    .normalizeEmail(),

  check('role', 'Invalid role: choose either "super_admin", "travel_admin", "manager", or "requester"')
    .isIn(['super_admin', 'travel_admin', 'manager', 'requester']),

  (req, res, next) => {
    const errors = validationResult(req);
    return errors.isEmpty()
      ? next()
      : res.status(422).json({
        status: 'error',
        error: customMessage(req).array()
      });
  }
];

export default validateRoleUpdate;
