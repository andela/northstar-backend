import models from '../db/models';
import sender from '../services/email.service';
import Response from '../utils/response.utils';
import valuesToUpdate from '../utils/request.utils';

const { Request, User, Booking } = models;
/**
* This class creates the user controller
*/
export default class RequestController {
  /**
  * @param {object} req The user's signup details
  * @param {object} res The user's details returned after signup
  * @returns {object} A signed up user
  */
  static async rejectRequest(req, res) {
    try {
      const request = await Request.update(
        {
          status: 'declined'
        }, { returning: true, where: { id: req.params.id } }
      );
      const requestResult = request[1][0];
      const user = await User.findOne({ where: { id: requestResult.user_id } });
      const { first_name: firstName, email } = user;
      // parameter(s) to be passed to the sendgrid email template
      await sender.sendEmail(process.env.SENDER_EMAIL, email, 'request_rejected', { firstName, email });
      return res.status(201).json({
        status: 'success',
        data: requestResult
      });
    } catch (error) {
      return res.status(500)
        .json({
          status: 'error',
          error: 'Error accessing the request route',
        });
    }
  }

  /**
  * @param {Object} req The user's token which is decoded to get the user's id
  * @param {Object} res List of request returned to the user
  * @returns {array} An array of objects or an empty one
  */
  static findAll(req, res) {
    Request.findAll({ where: { user_id: req.body.user_id } })
      .then((data) => {
        if (data.length) {
          return Response.Success(res, data, 200);
        }
        return Response.CustomError(res, 404, 'error', 'No requests found');
      })
      .catch((err) => Response.InternalServerError(res, err));
  }

  /**
 /**
    * @param {object} req
    * @param {object} res
    * @returns {json} request
    */
  static async createMultiCityRequest(req, res) {
    try {
      const { id: user_id } = req.currentUser.dataValues;
      const {
        category, origin, destination, departure_date, return_date, reason, room_id
      } = req.body;
      const bookingData = {
        departure_date, return_date, user_id, room_id
      };
      const booking = await models.Booking.create(bookingData);
      const { id: booking_id } = booking;
      const requestData = {
        user_id, category, origin, destination: destination.split(', '), departure_date, return_date, reason, booking_id
      };
      const request = await models.Request.create(requestData);
      return res.status(201).json({
        status: 'success',
        data: { request, booking }
      });
    } catch (error) {
      return res.status(500)
        .json({
          status: 'error',
          error: 'Internal server error',
        });
    }
  }

  /**
   * @method createReturnTripRequest
   *
   * @param {object} req
   * @param {object} res
   *
   * @returns {objet} status and message
   */
  static async createReturnTripRequest(req, res) {
    try {
      const { id: user_id } = req.user;
      const {
        booking_id,
        departure_date,
        destination,
        return_date,
        category,
        origin,
        reason
      } = req.body;

      const bookingExists = await Booking.findByPk(booking_id);

      if (!bookingExists) {
        return res
          .status(400)
          .json({
            status: 'error',
            error: {
              message: 'No booking with this booking_id exists.'
            },
          });
      }

      const newRequest = await Request.create({
        category,
        origin,
        destination,
        departure_date,
        return_date,
        reason,
        booking_id,
        user_id
      });

      return Response.Success(res, newRequest.dataValues, 201);
    } catch (error) {
      Response.CustomError(
        res,
        500,
        'error',
        'Request failed. Please see information below.',
        error.message
      );
    }
  }

  /**
     * @param {object} req The data which contains dates, reason, origin, destination etc
     * @param {object} res Response returned to the user
     * @returns {object} An object containing the request submitted into the db
     */
  static TripRequests(req, res) {
    const destination = [];
    const {
      user_id, category, origin, departure_date, reason, booking_id
    } = req.body;

    if (category === 'round-trip') {
      return RequestController.createReturnTripRequest(req, res);
    }

    const newRequest = {
      user_id, category, origin, destination, departure_date, reason, booking_id
    };

    // persist booking to database
    Request.create(newRequest)
      .then((data) => Response.Success(res, data, 201))
      .catch((error) => Response.CustomError(res, 500, 'error',
        'Request failed. Please see information below.',
        error.message));
  }

  /**
   * Retrieves a single travel request, alongside the associated
   * user (owner), and the associated booking from the database.
   * Only a travel request owner, owner manager, or super admin
   * can view a travel request
   * @param {object} req (Request object)
   * @param {object} res (ServerResponse object)
   * @param {function} next
   * @returns {object} ServerResponse object
   */
  static async getSingleRequest(req, res, next) {
    try {
      const request = await Request.findOne({
        where: { id: req.params.request_id },
        include: [
          { model: Booking },
          {
            model: User,
            attributes: ['id', 'email', 'first_name', 'last_name', 'location', 'role', 'manager_id']
          }]
      });
      if (!request) return Response.NotFoundError(res, 'Travel request not found');

      if (request.user_id !== req.body.user_id && req.body.role !== 'super_admin'
        && request.User.manager_id !== req.body.user_id) {
        return Response.UnauthorizedError(res, {
          message: 'You do not have permission to view this travel request'
        }, 403);
      }

      return Response.Success(res, request);
    } catch (error) {
      next(new Error('Internal server error'));
    }
  }

  /**
   * @method
   *
   * @param {object} req
   * @param {object} res
   *
   * @returns {object} server response
   */
  static async editRequest(req, res) {
    try {
      const requestObject = valuesToUpdate(req.body);
      const { user_id } = req.body;
      const { request_id: id } = req.params;

      // delete req.body.user_id;
      // delete req.body.role;

      const updatedRequest = await Request.update(
        requestObject,
        {
          where: { id, user_id },
          returning: true
        }
      );

      if (!updatedRequest) {
        return res
          .status(400)
          .json({
            status: 'error',
            error: {
              message: 'No request with this rßequest id exists.'
            },
          });
      }
      return Response.Success(res, updatedRequest, 200);
    } catch (error) {
      console.log(error);
      Response.CustomError(
        res,
        500,
        'error',
        'Request failed. Please see information below.',
        error.message
      );
    }
  }
}
