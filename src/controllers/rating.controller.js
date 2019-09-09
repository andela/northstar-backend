import models from '../db/models';
import Response from '../utils/response.utils';

const { Rating, Facility } = models;

/**
 * This class controls the rating for facilities
 */
export default class RatingController {
  /**
     * @param {Object} req Contains the param from the URL
     * @param {Object} res List of responses returned to the user
     * @returns {array} An array of objects containing ratings
     */
  static findAll(req, res) {
    Facility.findByPk(req.params.id)
      .then((data) => {
        if (!data) {
          return Response.CustomError(res, 404, 'error',
            `No facility found with ID: ${req.params.id}`, 'Consult the facility Admin');
        }
        Rating.findAll({
          where: { facility_id: req.params.id },
          attributes: ['id', 'facility_id', 'rating', 'created_at', 'updated_at']
        })
          .then((data) => {
            if (data.length) {
              return Response.Success(res, data, 200);
            }
            return Response.CustomError(res, 404, 'error', 'No rating found for this facility',
              'Please check again later');
          });
      })
      .catch((err) => Response.InternalServerError(res, err));
  }
}
