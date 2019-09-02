import models from '../db/models';

/**
 * This class creates the requests controller
 */
class RequestController {
    /**
     * @param {object} req 
     * @param {object} res
     * @returns {json} request 
     */

    static async createMultiCityRequest(req, res) {
        try {
            const { id: user_id } = req.tokenPayload.payload
            const { category, origin, destination, departure_date, return_date, reason, room_id } = req.body
            const bookingData = { departure_date, return_date, user_id, room_id }
            const booking = await models.Booking.create(bookingData);
            const {id: booking_id} = booking;
            const requestData = { user_id, category, origin, destination: destination.split(", "), departure_date, return_date, reason, booking_id }
            const request = await models.Request.create(requestData);
            return res.status(201).json({
                status: 'success',
                data: { request, booking }
            });
        } catch (error) {
            console.log('issa error', error)
            return res.status(500)
                .json({
                    status: 'error',
                    error: 'Internal server error',
                });
        }
    }
}

export default RequestController