import model from '../db/models/index';

const { Booking } = model;

/**
 * Bookings Controller
 */
export default class BookingController {
  /**
     * Checks in a user to a facility
     * @param {Object} req
     * @param {Object} res
     * @param {Callback} next | handles error
     * @returns {JSON} updatedBooking
     */
  static async checkInUser(req, res, next) {
    const { user } = req.body;
    const { booking_id } = req.params;

    try {
      const updatedBooking = await Booking.update(
        { checked_in: true },
        {
          where: { id: booking_id, user_id: user.id },
          returning: true
        }
      );
      return updatedBooking[1][0]
        ? res.status(200).json({
          status: 'success',
          data: updatedBooking[1][0]
        })
        : res.status(404).json({
          status: 'error',
          error: 'Could not find booking.'
        });
    } catch (error) { next(error); }
  }
}
