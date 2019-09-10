import models from '../db/models';
import Response from '../utils/response.utils';

const { Feedback, Facility, User } = models;

/**
 * This class controls the feedback for facilities
 */
export default class FeedbackController {
  /**
     * @param {Object} req Contains the param from the URL
     * @param {Object} res List of responses returned to the user
     * @returns {array} An array of objects containing feedback
     */
  static findAll(req, res) {
    Facility.findByPk(req.params.id)
      .then((data) => {
        if (!data) {
          return Response.CustomError(res, 404, 'error',
            `No facility found with ID: ${req.params.id}`, 'Consult the facility Admin');
        }
        Feedback.findAll({
          where: { facility_id: req.params.id },
          attributes: ['id', 'facility_id', 'feedback', 'created_at', 'updated_at'],
          include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'first_name', 'last_name']
          }],
        })
          .then((data) => {
            if (data.length) {
              return Response.Success(res, data, 200);
            }
            return Response.CustomError(res, 404, 'error', 'No feedback found for this facility',
              'Please check again later');
          });
      })
      .catch((err) => Response.InternalServerError(res, err));
  }
}
