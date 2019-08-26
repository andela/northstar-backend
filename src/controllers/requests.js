import models from '../db/models';
import { request } from 'http';

/**
 * This class creates the requests controller
 */
export default class RequestController {
    /**
     * @param {object} req 
     * @param {object} res
     */

    static async createMultiCityRequest(req, res) {
        try {
            const { user } = request
            const { category, from, destination, depature_date, return_date, reason, rooms } = req.body
            const { id } = user
            const tripData = { user_id: id, category, from, destination, depature_date, return_date, reason }
            const trip = await models.Trip.create(tripData);
            const booking = promise.all(
                rooms.forEach(async (room_id) => {
                    const bookingData = { user_id: id, room_id, trip_id: trip.id }
                    await model.Booking.create(bookingData);
                })
            );
            trip.accommodation = booking;
            return res.status(200).json({
                status: 'success',
                data: trip
            });
        } catch (error) {
            return res.status(500)
                .json({
                    status: 'error',
                    error: 'Could not create request',
                });
        }
    }
}

export default RequestController
