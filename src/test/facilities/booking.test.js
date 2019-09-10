import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';

import JWTService from '../../services/jwt.service';
import app from '../../index';
import models from '../../db/models';

chai.use(chaiHttp);


const { expect } = chai;
const { Booking } = models;
const userToken = JWTService.generateToken({ id: 3, role: 'reqeuster' });
const baseUrl = '/api/v1/facilities/rooms';


describe(`POST ${baseUrl}/:room_id/book`, () => {
  describe('SUCCESS', () => {
    it('should book an accomodation for a time not yet booked', async () => {
      const roomId = 2;
      const testBookingData = {
        // Coming in one month time
        departure_date: new Date(new Date().getTime() + 30 * 24 * 3600000)
          .toISOString().split('T')[0],
        // To spend 3 months
        return_date: new Date(new Date().getTime() + 120 * 24 * 3600000)
          .toISOString().split('T')[0]
      };

      const res = await chai.request(app)
        .post(`${baseUrl}/${roomId}/book`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(testBookingData);

      expect(res.status).to.equal(201);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.keys('status', 'data');
      expect(res.body.status).to.equal('success');
      expect(res.body.data).to.be.an('object');
      expect(res.body.data).to.have.keys('id', 'user_id', 'room_id',
        'departure_date', 'return_date', 'checked_in', 'createdAt', 'updatedAt');
      expect(res.body.data.user_id).to.equal(3);
      expect(res.body.data.room_id).to.be.equal(roomId);
      expect(res.body.data.departure_date).to.equal(new Date(
        testBookingData.departure_date).toISOString().split('T')[0])
      expect(res.body.data.return_date).to.equal(new Date(
          testBookingData.return_date).toISOString().split('T')[0])
    });

    it('should book same accomodation for a different time and interval', async () => {
      const roomId = 2;
      const testBookingData = {
        // Coming in 5 month time
        departure_date: new Date(new Date().getTime() + 150 * 24 * 3600000)
          .toISOString().split('T')[0],
        // To spend a week
        return_date: new Date(new Date().getTime() + 157 * 24 * 3600000)
          .toISOString().split('T')[0]
      };

      const res = await chai.request(app)
        .post(`${baseUrl}/${roomId}/book`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(testBookingData);

      expect(res.status).to.equal(201);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.keys('status', 'data');
      expect(res.body.status).to.equal('success');
      expect(res.body.data).to.be.an('object');
      expect(res.body.data).to.have.keys('id', 'user_id', 'room_id',
        'departure_date', 'return_date', 'checked_in', 'createdAt', 'updatedAt');
      expect(res.body.data.user_id).to.equal(3);
      expect(res.body.data.room_id).to.be.equal(roomId);
      expect(res.body.data.departure_date).to.equal(new Date(
        testBookingData.departure_date).toISOString().split('T')[0])
      expect(res.body.data.return_date).to.equal(new Date(
          testBookingData.return_date).toISOString().split('T')[0])
    });
  });


  describe('FAILURE', () => {
    it('should fail to book an accomodation when token not provided', async () => {
      const roomId = 2;
      const res = await chai.request(app)
        .post(`${baseUrl}/${roomId}/book`)
        .send({
          // Coming in 6 month time
          departure_date: new Date(new Date().getTime() + 180 * 24 * 3600000)
            .toISOString().split('T')[0],
          // To spend a week
          return_date: new Date(new Date().getTime() + 187 * 24 * 3600000)
            .toISOString().split('T')[0]
        });
      
      expect(res.status).to.equal(401);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.keys('status', 'error');
      expect(res.body.status).to.equal('error');
      expect(res.body.error).to.equal('No token provided!');
    });

    it('should fail to book an accomodation when invalid token is provided',
      async () => {
        const roomId = 2;
        const res = await chai.request(app)
          .post(`${baseUrl}/${roomId}/book`)
          .set('Authorization', `Bearer ${new Array(10).fill('pkdlfm').join('')}`)
          .send({
            // Coming in 6 month time
            departure_date: new Date(new Date().getTime() + 180 * 24 * 3600000)
              .toISOString().split('T')[0],
            // To spend a week
            return_date: new Date(new Date().getTime() + 187 * 24 * 3600000)
              .toISOString().split('T')[0]
          });
        
        expect(res.status).to.equal(401);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.equal('error');
        expect(res.body.error).to.equal('Invalid authentication token.');
      });

    it('should fail to book an accomodation with a valid token for which user exist not in the db',
      async () => {
        const nonExistingUserToken = JWTService.generateToken({ id: 1000, role: 'requester' });
        const roomId = 2;
        const res = await chai.request(app)
          .post(`${baseUrl}/${roomId}/book`)
          .set('Authorization', `Bearer ${nonExistingUserToken}`)
          .send({
            // Coming in 6 month time
            departure_date: new Date(new Date().getTime() + 180 * 24 * 3600000)
              .toISOString().split('T')[0],
            // To spend a week
            return_date: new Date(new Date().getTime() + 187 * 24 * 3600000)
              .toISOString().split('T')[0]
          });
        
        expect(res.status).to.equal(401);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.equal('error');
        expect(res.body.error).to.equal('Failed to authenticate token');
      });

    it('should fail to book an accomodation with no departure date provided',
      async () => {
        const roomId = 2;
        const res = await chai.request(app)
          .post(`${baseUrl}/${roomId}/book`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({
            return_date: new Date(new Date().getTime() + 187 * 24 * 3600000)
              .toISOString().split('T')[0]
          });
        
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.equal('error');
        expect(res.body.error).to.have.property('departure_date')
        expect(res.body.error.departure_date).to.equal(
          'Invalid date. Please ensure the date in the format YYYY-MM-DD');
      });

    it('should fail to book an accomodation with no return date provided',
      async () => {
        const roomId = 2;
        const res = await chai.request(app)
          .post(`${baseUrl}/${roomId}/book`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({
            // Coming in 6 month time
            departure_date: new Date(new Date().getTime() + 180 * 24 * 3600000)
              .toISOString().split('T')[0]
          });
        
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.equal('error');
        expect(res.body.error).to.have.property('return_date')
        expect(res.body.error.return_date).to.equal(
          'Invalid date. Please ensure the date in the format YYYY-MM-DD');
      });

    it('should fail to book an accomodation when invalid departure date is provided',
      async () => {
        const roomId = 2;
        const res = await chai.request(app)
          .post(`${baseUrl}/${roomId}/book`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({
            // Invalid departure date
            departure_date: '2020-06-32',
            return_date: new Date(new Date().getTime() + 187 * 24 * 3600000)
              .toISOString().split('T')[0]
          });
        
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.equal('error');
        expect(res.body.error).to.have.property('departure_date')
        expect(res.body.error.departure_date).to.equal(
          'Invalid date. Please ensure the date in the format YYYY-MM-DD');
      });

    it('should fail to book an accomodation when invalid return date is provided',
      async () => {
        const roomId = 2;
        const res = await chai.request(app)
          .post(`${baseUrl}/${roomId}/book`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({
            // Coming in 6 month time
            departure_date: new Date(new Date().getTime() + 180 * 24 * 3600000)
              .toISOString().split('T')[0],
            return_date: '2020-13-10'
          });
        
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.equal('error');
        expect(res.body.error).to.have.property('return_date')
        expect(res.body.error.return_date).to.equal(
          'Invalid date. Please ensure the date in the format YYYY-MM-DD');
      });

    it('should fail to book an accomodation when departure and return dates are same',
      async () => {
        const roomId = 2;
        const res = await chai.request(app)
          .post(`${baseUrl}/${roomId}/book`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({
            // Coming in 6 month time
            departure_date: new Date(new Date().getTime() + 180 * 24 * 3600000)
              .toISOString().split('T')[0],
            // Same day
            return_date: new Date(new Date().getTime() + 180 * 24 * 3600000)
            .toISOString().split('T')[0]
          });
        
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.equal('error');
        expect(res.body.error).to.have.property('intervalError')
        expect(res.body.error.intervalError).to.equal(
          'The return date must be ahead of the departure date');
      });

    it('should fail to book an accomodation when departure date is ahead of return date',
      async () => {
        const roomId = 2;
        const res = await chai.request(app)
          .post(`${baseUrl}/${roomId}/book`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({
            // Coming in 6 month time
            departure_date: new Date(new Date().getTime() + 182 * 24 * 3600000)
              .toISOString().split('T')[0],
            // Two days before departure date
            return_date: new Date(new Date().getTime() + 180 * 24 * 3600000)
            .toISOString().split('T')[0]
          });
        
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.equal('error');
        expect(res.body.error).to.have.property('intervalError')
        expect(res.body.error.intervalError).to.equal(
          'The return date must be ahead of the departure date');
      });

    it('should fail to book an accomodation when departure date is less than today',
      async () => {
        const roomId = 2;
        const res = await chai.request(app)
          .post(`${baseUrl}/${roomId}/book`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({
            // 2 days ago
            departure_date: new Date(new Date().getTime() - 2 * 24 * 3600000)
              .toISOString().split('T')[0],
            // Six months away
            return_date: new Date(new Date().getTime() + 180 * 24 * 3600000)
            .toISOString().split('T')[0]
          });
        
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.equal('error');
        expect(res.body.error).to.have.property('departureDateError')
        expect(res.body.error.departureDateError).to.equal(
          'Departure date cannot be lesser than today');
      });

    it('should fail to book an accomodation when referenced room does not exist',
      async () => {
        const res = await chai.request(app)
          .post(`${baseUrl}/120/book`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({
            // Coming in 6 month time
            departure_date: new Date(new Date().getTime() + 180 * 24 * 3600000)
              .toISOString().split('T')[0],
            // To spend a week
            return_date: new Date(new Date().getTime() + 187 * 24 * 3600000)
              .toISOString().split('T')[0]
          });
        
        expect(res.status).to.equal(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.equal('error');
        expect(res.body.error).to.be.an('object');
        expect(res.body.error).to.have.key('message');
        expect(res.body.error.message).to.equal('Room not found');
      });

    it('should fail to book an accomodation when both departure and return dates sought for a '
      + 'new booking fall within an existing booking\'s dates for same room',
      async () => {
        const roomId = 2;
        const res = await chai.request(app)
          .post(`${baseUrl}/${roomId}/book`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({
            // Coming in two months time, while an existing booking starts in a month time
            departure_date: new Date(new Date().getTime() + 60 * 24 * 3600000)
              .toISOString().split('T')[0],
            // To spend 1 month, the existing booking ends in 4 months time
            return_date: new Date(new Date().getTime() + 90 * 24 * 3600000)
              .toISOString().split('T')[0]
          });

        expect(res.status).to.equal(409);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.equal('error');
        expect(res.body.error).to.be.an('object');
        expect(res.body.error).to.have.keys('message');
        expect(res.body.error.message.startsWith('This accomodation is already book from'))
          .to.be.true;
      });

    it('should fail to book an accomodation when both departure and return dates for an '
      + 'existing booking fall within the dates sought for a new booking for same room' ,
        async () => {
          const roomId = 2;
          const res = await chai.request(app)
            .post(`${baseUrl}/${roomId}/book`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({
              // An existing booking starts in one month time, this starts in two weeks
              departure_date: new Date(new Date().getTime() + 14 * 24 * 3600000)
                .toISOString().split('T')[0],
              // The existing booking ends in 4 months time, this ends in 8 months
              return_date: new Date(new Date().getTime() + 240 * 24 * 3600000)
                .toISOString().split('T')[0]
            });

          expect(res.status).to.equal(409);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys('status', 'error');
          expect(res.body.status).to.equal('error');
          expect(res.body.error).to.be.an('object');
          expect(res.body.error).to.have.keys('message');
          expect(res.body.error.message.startsWith('This accomodation is already book from'))
            .to.be.true;
        });

    it('should fail to book an accomodation when only the departure date sought for a new '
      + 'booking falls within an existing booking\'s dates for same room',
      async () => {
        const roomId = 2;
        const res = await chai.request(app)
          .post(`${baseUrl}/${roomId}/book`)
          .set('Authorization', `Bearer ${userToken}`)
          .send({
            // Coming in two months time, while an existing booking starts in a month time
            departure_date: new Date(new Date().getTime() + 60 * 24 * 3600000)
              .toISOString().split('T')[0],
            // Ends in 6 months, the existing booking ends in 4 months time
            return_date: new Date(new Date().getTime() + 180 * 24 * 3600000)
              .toISOString().split('T')[0]
          });

        expect(res.status).to.equal(409);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.equal('error');
        expect(res.body.error).to.be.an('object');
        expect(res.body.error).to.have.keys('message');
        expect(res.body.error.message.startsWith('This accomodation is already book from'))
          .to.be.true;
      });

    it('should fail to book an accomodation when only the return date sought for a new '
      + 'booking falls within an existing booking\'s dates for same room',
        async () => {
          const roomId = 2;
          const res = await chai.request(app)
            .post(`${baseUrl}/${roomId}/book`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({
              // Coming in two weeks time, while an existing booking starts in a month time
              departure_date: new Date(new Date().getTime() + 14 * 24 * 3600000)
                .toISOString().split('T')[0],
              // To spend 2 months, the existing booking ends in 4 months time
              return_date: new Date(new Date().getTime() + 74 * 24 * 3600000)
                .toISOString().split('T')[0]
            });

          expect(res.status).to.equal(409);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys('status', 'error');
          expect(res.body.status).to.equal('error');
          expect(res.body.error).to.be.an('object');
          expect(res.body.error).to.have.keys('message');
          expect(res.body.error.message.startsWith('This accomodation is already book from'))
            .to.be.true;
        });

    it('should test for internal server error', async () => {
      const stub = sinon.stub(Booking, 'create').throws(new Error());
      const roomId = 2;
      const res = await chai.request(app)
        .post(`${baseUrl}/${roomId}/book`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          // Coming in 6 month time
          departure_date: new Date(new Date().getTime() + 180 * 24 * 3600000)
            .toISOString().split('T')[0],
          // To spend a week
          return_date: new Date(new Date().getTime() + 187 * 24 * 3600000)
            .toISOString().split('T')[0]
        });
      
      expect(res.status).to.equal(500);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.keys('status', 'error');
      expect(res.body.status).to.equal('error');
      expect(res.body.error).to.have.key('message');
      expect(res.body.error.message).to.equal('Internal server error');
      stub.restore();
    });
  });  
})
