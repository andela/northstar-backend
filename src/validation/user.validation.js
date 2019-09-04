import { check, validationResult } from 'express-validator';

const customMessage = validationResult.withDefaults({
  formatter: (error) => ({
    field: error.param,
    message: error.msg
  })
});

const signupValidator = [
  check('first_name', 'Invalid first name.')
    .not().isEmpty().withMessage('First name is required')
    .isAlpha()
    .withMessage('Special characters and digits are not allowed')
    .isLength({
      min: 2,
      max: 20
    })
    .withMessage('Too short: Enter a miximum of 20 and a minimum of 2 characters.'),

  check('last_name', 'Invalid last name.')
    .not().isEmpty().withMessage('Last name is required')
    .isAlpha()
    .withMessage('Special characters and digits are not allowed')
    .isLength({
      min: 2,
      max: 20
    })
    .withMessage('Too short: Enter a miximum of 20 and a minimum of 2 characters.'),

  check('email', 'Invalid Email')
    .not().isEmpty().withMessage('Email is required')
    .isEmail()
    .normalizeEmail(),

  check('password', 'Invalid password')
    .not().isEmpty().withMessage('Password is required')
    .isLength({ min: 6, max: 20 })
    .withMessage('password must be at least 6 characters')
    .not()
    .matches(/\s/, 'g')
    .withMessage('password cannot contain whitespace'),

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

export default signupValidator;
