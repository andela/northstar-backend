import models from '../db/models';
import Response from '../utils/response.utils';
import FacilityUtils from '../utils/facility.utils';

const {
  Facility, Room, Like, Booking
} = models;

/**
 * This class creates the facilities controllers
 */
export default class FacilitiesController {
  /**
   * @param {object} req The facility details
   * @param {object} res The facility details returned after listing a facility
   * @returns {object} A newly created facility
   */
  static async createFacilities(req, res) {
    const { facilitiesValues } = req.body;
    try {
      const newAddress = facilitiesValues.street.concat(', ', facilitiesValues.address, ', ', facilitiesValues.city, ', ', facilitiesValues.country);
      const facility = await Facility.create(
        {
          name: facilitiesValues.name,
          address: newAddress,
          number_of_rooms: facilitiesValues.number_of_rooms,
          available_space: facilitiesValues.available_space,
          images: facilitiesValues.images,
          description: facilitiesValues.description
        },
        { returning: true }
      );
      return Response.Success(res, facility, 201);
    } catch (error) {
      return Response.InternalServerError(res, 'Could not register facility');
    }
  }

  /**
   * @param {object} req The room details
   * @param {object} res The room details returned after creating a room
   * @returns {object} A newly registered room
   */
  static async createRoom(req, res) {
    const { roomsValues } = req.body;
    try {
      const room = await Room.create(
        roomsValues,
        { returning: true }
      );

      return Response.Success(res, room, 201);
    } catch (error) {
      return Response.InternalServerError(res, 'Could not register rooms');
    }
  }

  /**
   * @param {object} req
   * @param {object} res The facilities being returned
   * @returns {object} All the facilities on the facilities table
   */
  static async getAllFacilities(req, res) {
    try {
      const facilities = await Facility.findAll({ returning: true });
      if (facilities.length < 1) {
        return res.status(404).json({
          status: 'success',
          message: 'There is no facilities listed on barefoot nomad at this time'
        });
      }
      return Response.Success(res, facilities, 200);
    } catch (error) {
      return Response.InternalServerError(res, 'Could not return facilities');
    }
  }

  /**
   * @param {object} req
   * @param {object} res The facilities being returned
   * @returns {object} All the facilities on the facilities table
   */
  static async likeOrUnlikeFacility(req, res) {
    try {
      const [like, created] = await Like.findOrCreate(
        {
          where: {
            facility_id: req.params.facility_id,
            user_id: req.currentUser.id
          },
          defaults: { status: true }
        }
      );
      if (!created) {
        const unlike = await Like.update(
          { status: !like.status },
          {
            where: {
              facility_id: req.params.facility_id,
              user_id: req.currentUser.id
            },
            returning: true
          }
        );
        return Response.Success(res, unlike[1][0], 200);
      }

      return Response.Success(res, like, 201);
    } catch (error) {
      return Response.InternalServerError(res, 'Could not like facility');
    }
  }

  /**
   * Books a room in an accomodation facility
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @return {object|function} ServerResponse or next
   */
  static async bookFacility(req, res, next) {
    const { room_id } = req.params, { id: user_id } = req.currentUser;
    try {
      // Confirm the specified room exists, else return a 404
      const room = await Room.findByPk(room_id, { attributes: [] });
      if (!room) return Response.NotFoundError(res, 'Room not found');
      // Check if an existing booking conflicts with the one to be made and return a 409
      const { departure_date, return_date } = req.body;
      const conflictingBooking = await Booking.findOne(FacilityUtils
        .getConflictingBookingQuery(room_id, departure_date, return_date));

      if (conflictingBooking) {
        return Response.ConflictError(res, {
          message: `This accomodation is already book from ${conflictingBooking.departure_date} to ${
            conflictingBooking.return_date}`
        });
      }
      // If all checks out so far, create a new booking and return its details
      const newBooking = await Booking.create({
        room_id, user_id, departure_date, return_date
      }, { returning: true });

      return Response.Success(res, newBooking.dataValues, 201);
    } catch (error) { next(new Error('Internal server error')); }
  }
}
