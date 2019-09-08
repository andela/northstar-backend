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


const validateProfileUpdate = [
  check('first_name', 'Supply a first name consisting of letters only.')
    .optional()
    .isAlpha()
    .isLength({ max: 30 })
    .withMessage('Too long: enter a maximum of 30 characters.')
    .isLength({ min: 2 })
    .withMessage('Too short: enter a minimum of 2 characters'),

  check('last_name', 'Supply a last name consisting of alphabets only.')
    .optional()
    .isAlpha()
    .isLength({ max: 30 })
    .withMessage('Too long: enter a maximum of 30 characters.')
    .isLength({ min: 2 })
    .withMessage('Too short: enter a minimum of 2 characters.'),


  check('gender', 'Gender should either be "male", "female" or "other".')
    .optional()
    .isIn(['male', 'female', 'other']),

  check('birth_date', 'Invalid date.')
    .optional()
    .isISO8601()
    .isBefore('2005-01-01')
    .withMessage('Birthday should be before 2005-01-01.'),

  check('preferred_language')
    .optional()
    .isAlpha()
    .withMessage('Numbers and special characters are not allowed.')
    .isLength({ min: 2 })
    .withMessage('Too short: enter a minimum of 2 characters.')
    .isLength({ max: 20 })
    .withMessage('Too long: enter a maximum of 20 characters.'),

  check('preferred_currency', 'Currency can either be "NGN", "USD", "GBP", "EUR" or "YEN".')
    .optional()
    .isIn(['NGN', 'USD', 'GBP', 'EUR', 'YEN']),

  check('location', 'Invalid location. Special characters other than ".", "-" and "," are not allowed.')
    .optional()
    .matches(/[^a-z,-.]/i)
    .isLength({ min: 2 })
    .withMessage('Too short: enter a minimum of 2 characters.')
    .isLength({ max: 50 })
    .withMessage('Too long: enter a maximum of 50 characters.'),

  check('email_notification', 'Email notification is a boolean.')
    .optional()
    .isBoolean(),

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

export default validateProfileUpdate;
