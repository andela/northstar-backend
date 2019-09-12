import models from '../db/models';
import Response from '../utils/response.utils';
import RatingsCalculator from '../utils/rating.utils';

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
    const { id: facility_id } = req.params;

    Facility.findByPk(facility_id)
      .then((data) => {
        if (!data) {
          return Response.CustomError(res, 404, 'error',
            `No facility found with ID: ${req.params.id}`, 'Consult the facility Admin');
        }

        Rating.findAll({
          where: { facility_id },
          attributes: ['facility_id', 'rating']
        })
          .then((data) => {
            if (data.length) {
              const ratings = RatingsCalculator(data);
              return Response.Success(res, ratings, 200);
            }
            return Response.CustomError(res, 404, 'error', 'No rating found for this facility',
              'Please check again later');
          });
      })
      .catch((err) => Response.InternalServerError(res, err));
  }
}
