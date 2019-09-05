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

const validateComment = [
  check('request_id', 'Invalid request id.')
    .isInt(),

  check('comment', 'Please enter comment.')
    .isLength({ min: 1 })
    .isLength({ max: 350 })
    .withMessage('Too long. Enter a maximum of 350 characters'),

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

export default validateComment;
