import models from '../db/models';
import Response from '../utils/response.utils';

const {
  Feedback, Rating, Facility, Booking
} = models;

/**
 * This class controls the feedback and rating for facilities
 */
export default class RatingAndFeedbackController {
  /**
     * @param {Object} req Contains the rating/feedback (optional)
     * @param {Object} res List of responses returned to the user
     * @returns {array} An array of objects containing rating/feedback
     */
  static async postRatingAndFeedback(req, res) {
    let { feedback } = req.body;
    const { facility_id, rating, user_id } = req.body;

    if (typeof feedback === 'undefined' || feedback === '') {
      feedback = 'None';
    }

    try {
      // check if facility exists
      const facility = await Facility.findByPk(facility_id);

      // if facility does not exist, return error message
      if (!facility) {
        return Response.CustomError(res, 404, 'error',
          `No facility found with ID: ${facility_id}`, 'Consult the Travel Admin');
      }

      // if facility exists, check if user has rated before
      const oldRating = await Rating.findOne({ where: { user_id, facility_id } });

      // if user has rated before, tell them they cannot rate again
      if (oldRating) {
        return Response.CustomError(res, 401, 'error',
          'Oops! Something went wrong', 'Looks like you\'ve rated this facility before');
      }

      // if facility exists, check if user has checked in
      const hasCheckedIn = await Booking.findAll({
        where: { user_id, facility_id, checked_in: true }
      });

      // if user hasn't checked in, return error message
      if (!hasCheckedIn.length) {
        return Response.CustomError(res, 401, 'error',
          'Error posting rating/feedback',
          'You need to have checked into this facility at least once');
      }

      // if user has checked in, then post the rating plus feedback (optional)
      const user_rating = await Rating.create({ rating, user_id, facility_id });
      const user_feedback = await Feedback.create({ feedback, user_id, facility_id });

      return Response.Success(res, { user_rating, user_feedback }, 201);
    } catch (err) {
      return Response.InternalServerError(res, err.message);
    }
  }
}
