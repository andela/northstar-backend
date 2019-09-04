import models from '../db/models';
import Response from '../utils/response.utils';

const { Facility, Room } = models;

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
      const facility = await Facility.create(
        facilitiesValues,
        { returning: true }
      );
      return Response.Success(res, facility, 201);
    } catch (error) {
      console.log(error)
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

      if (facilities.lenght < 1) {
        return res.status(404).json({
          status: 'success',
          error: 'There is no facilities listed on barefoot nomad at this time'
        });
      }

      return Response.Success(res, facilities, 200);
    } catch (error) {
      return Response.InternalServerError(res, 'Could not return facilities');
    }
  }
}
