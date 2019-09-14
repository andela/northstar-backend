import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';

import app from '../../index';
import models from '../../db/models';
import JWTService from '../../services/jwt.service';


chai.use(chaiHttp);
chai.should();

const { expect } = chai;
const { Request } = models;


describe('GET /api/v1/requests/:request_id', () => {
  const urlBase = '/api/v1/requests';

  describe('SUCCESS', () => {
    it('should fetch a request for the request owner', async () => {
      const userDetails = { id: 3, role: 'requester' };
      const requestId = 2;
      const userToken = JWTService.generateToken(userDetails);

      const res = await chai.request(app)
        .get(`${urlBase}/${requestId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send();

      expect(res.status).to.equal(200);
      expect(res.body).to.have.keys('status', 'data');
      expect(res.body.status).to.equal('success');
      expect(res.body.data).to.be.an('object');
      expect(res.body.data).to.have.keys('id', 'user_id', 'category', 'origin',
        'destination', 'departure_date', 'return_date', 'reason', 'booking_id',
        'createdAt', 'updatedAt', 'status', 'User', 'Booking');
      expect(res.body.data.id).to.equal(requestId);
      expect(res.body.data.user_id).to.equal(userDetails.id);
      expect(res.body.data.User.id).to.equal(userDetails.id);
      expect(res.body.data.booking_id).to.equal(res.body.data.Booking.id);
    });

    it('should fetch a request for request owner\'s manager', async () => {
      const userDetails = { id: 1, role: 'manager' };
      const requestId = 2;
      const userToken = JWTService.generateToken(userDetails);

      const res = await chai.request(app)
        .get(`${urlBase}/${requestId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send();

      expect(res.status).to.equal(200);
      expect(res.body).to.have.keys('status', 'data');
      expect(res.body.status).to.equal('success');
      expect(res.body.data).to.be.an('object');
      expect(res.body.data).to.have.keys('id', 'user_id', 'category', 'origin',
        'destination', 'departure_date', 'return_date', 'reason', 'booking_id',
        'createdAt', 'updatedAt', 'status', 'User', 'Booking');
      expect(res.body.data.id).to.equal(requestId);
      expect(res.body.data.User.manager_id).to.equal(userDetails.id);
      expect(res.body.data.booking_id).to.equal(res.body.data.Booking.id);
    });

    it('should fetch a request for a super admin', async () => {
      const userDetails = { id: 5, role: 'super_admin' };
      const requestId = 2;
      const userToken = JWTService.generateToken(userDetails);

      const res = await chai.request(app)
        .get(`${urlBase}/${requestId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send();

      expect(res.status).to.equal(200);
      expect(res.body).to.have.keys('status', 'data');
      expect(res.body.status).to.equal('success');
      expect(res.body.data).to.be.an('object');
      expect(res.body.data).to.have.keys('id', 'user_id', 'category', 'origin',
        'destination', 'departure_date', 'return_date', 'reason', 'booking_id',
        'createdAt', 'updatedAt', 'status', 'User', 'Booking');
      expect(res.body.data.id).to.equal(requestId);
      expect(res.body.data.booking_id).to.equal(res.body.data.Booking.id);
    });
  });

  describe('FAILURE', () => {
    const permissionError = 'You do not have permission to view this travel request';

    it('should not fetch request with no token supplied',
      async () => {
        const requestId = 2;
        const res = await chai.request(app)
          .get(`${urlBase}/${requestId}`)
          .send();

        expect(res.status).to.equal(403);
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.equal('error');
        expect(res.body.error.message).to.equal('You must be logged in to proceed');
      });

    it('should not fetch request with invalid token supplied', async () => {
      const requestId = 2;
      const res = await chai.request(app)
        .get(`${urlBase}/${requestId}`)
        .set('Authorization', `Bearer ${new Array(15).fill('kfkfjd42g').join('')}`)
        .send();

      expect(res.status).to.equal(400);
      expect(res.body).to.have.keys('status', 'error');
      expect(res.body.status).to.equal('error');
      expect(res.body.error.message).to.equal('Authentication failed!');
    });

    it('should not fetch request for a non-owner, non-manager, non-super admin user',
      async () => {
        const userDetails = { id: 4, role: 'requester' };
        const requestId = 2;
        const userToken = JWTService.generateToken(userDetails);

        const res = await chai.request(app)
          .get(`${urlBase}/${requestId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send();

        expect(res.status).to.equal(403);
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.equal('error');
        expect(res.body.error.message).to.equal(permissionError);
      });

    it('should not fetch request for a manager otherwise of owner\'s manager',
      async () => {
        const userDetails = { id: 2, role: 'manager' };
        const requestId = 2;
        const userToken = JWTService.generateToken(userDetails);

        const res = await chai.request(app)
          .get(`${urlBase}/${requestId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send();

        expect(res.status).to.equal(403);
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.equal('error');
        expect(res.body.error.message).to.equal(permissionError);
      });

    it('should not fetch non-existing travel request',
      async () => {
        const userDetails = { id: 4, role: 'requester' };
        const requestId = 112;
        const userToken = JWTService.generateToken(userDetails);

        const res = await chai.request(app)
          .get(`${urlBase}/${requestId}`)
          .set('Authorization', `Bearer ${userToken}`)
          .send();

        expect(res.status).to.equal(404);
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.equal('error');
        expect(res.body.error.message).to.equal('Travel request not found');
      });

    it('should fake a server error', async () => {
      const userDetails = { id: 4, role: 'requester' };
      const userToken = JWTService.generateToken(userDetails);
      const stub = sinon.stub(Request, 'findOne').throws(new Error());

      const res = await chai.request(app)
        .get(`${urlBase}/2`)
        .set('Authorization', `Bearer ${userToken}`)
        .send();
      // Restore default behaviour of stub
      stub.restore();

      expect(res.status).to.equal(500);
      expect(res.body).to.have.keys('status', 'error');
      expect(res.body.status).to.equal('error');
      expect(res.body.error.message).to.equal('Internal server error');
    });
  });
});
