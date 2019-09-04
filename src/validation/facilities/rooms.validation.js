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

const validateRooms = [
  check('name', 'Kindly Provide a name for your room')
    .not()
    .isEmpty()
    .isString()
    .withMessage('The name of your facility rooms must be a string')
    .isLength({ min: 2 })
    .withMessage('Too short: enter a minimum of 2 characters'),

  check('type', 'Kindly enter the type of room')
    .not()
    .isEmpty()
    .isString()
    .withMessage('The address of your facility rooms must be a string')
    .isLength({ min: 5 })
    .withMessage('Too short: enter a minimum of 5 characters'),

  check('price', 'You must attach a price tag to a room')
    .not()
    .isEmpty()
    .isNumeric()
    .withMessage('Price of Rooms must be a number'),

  check('facility_id', 'Please provide a valid facility number')
    .not()
    .isEmpty()
    .isInt()
    .withMessage('Facility ID must be a number'),

  check('images', 'Images must be an array')
    .isArray(),

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

export default validateRooms;
