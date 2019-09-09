import models from '../db/models';
import Response from '../utils/response.utils';

const { Feedback, Facility } = models;

/**
 * This class controls the feedback for facilities
 */
export default class FeedbackController {
  /**
     * @param {Object} req Contains the param from the URL
     * @param {Object} res List of responses returned to the user
     * @returns {array} An array of objects containing feedback
     */
  static postFeedback(req, res) {
    const { id: facility_id } = req.params;
    const { feedback, user_id } = req.body;

    // check if facility exists
    Facility.findByPk(req.params.id)
      .then((data) => {
        if (!data) {
          return Response.CustomError(res, 404, 'error',
            `No facility found with ID: ${req.params.id}`, 'Consult the facility Admin');
        }
      })
      .catch((err) => Response.InternalServerError(res, err));

    // post the feedback
    Feedback.create({
      user_id,
      facility_id,
      feedback
    })
      .then((data) => {
          return Response.Success(res, data, 201);
      })
      .catch((err) => Response.CustomError(err, 404, 'error', 'Oops! Something went wrong',
        'Please check again later'));
  }
}
