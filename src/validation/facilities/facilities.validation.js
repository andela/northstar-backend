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


const validateFacilities = [
  check('name', 'Kindly Provide a name for your facility')
    .not()
    .isEmpty()
    .isString()
    .withMessage('The name of your facility must be a string')
    .isLength({ min: 2 })
    .withMessage('Too short: enter a minimum of 2 characters'),

  check('address', 'Kindly Provide a valid address for your facility')
    .not()
    .isEmpty().isString()
    .withMessage('The address of your facility must be a string')
    .isLength({ min: 5 })
    .withMessage('Too short: enter a minimum of 5 characters'),

  check('number_of_rooms', 'Number of Rooms must not be empty')
    .not()
    .isEmpty()
    .isInt()
    .withMessage('Number of Rooms must be a a number'),

  check('available_space', 'Available Space must not be empty')
    .not()
    .isEmpty()
    .isInt()
    .withMessage('Awailable space must be a a number'),

  check('images', 'Images must be an array')
    .isArray(),

  check('description', 'Enter few sentences to describe you facility')
    .not()
    .isEmpty().isString()
    .withMessage('The description of your facility must be a string')
    .isLength({ min: 10 })
    .withMessage('Too short: enter a minimum of 10 characters'),


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

export default validateFacilities;
