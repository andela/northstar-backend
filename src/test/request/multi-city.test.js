import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import Sinonchai from 'sinon-chai';
import app from '../../index';
import RequestController from '../../controllers/request.controller';

chai.use(Sinonchai);
chai.use(chaiHttp);
chai.should();
const { expect } = chai;

describe('Requests', () => {
  let token;
  before('signup to get access userToken', (done) => {
    const user = {
      email: 'chiwe@gmail.com',
      first_name: 'Chinwe',
      last_name: 'Okonkwo',
      password: 'secret123',
      role: 'requester',
      gender: 'female',
      birth_date: '02-02-2019',
      preferred_language: 'english',
      preferred_currency: 'USD',
      location: 'lagos'
    };

    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((error, res) => {
        token = res.body.data.token;
        done();
      });
  });
  describe('/POST multi-city request', () => {
    const requestData = {
      category: 'multi-city',
      origin: 'Lagos Nigeria',
      destination: 'Kigali, Rwanda, london',
      departure_date: '12-20-2019',
      return_date: '12-20-2019',
      reason: 'Duty calls',
      room_id: 2,
      facility_id: 1
    };
    it('it should successfully create a multi-city request trip', (done) => {
      chai
        .request(app)
        .post('/api/v1/request/multi-city')
        .send(requestData)
        .set('authorization', token)
        .end((err, res) => {
          expect(res).to.be.an('object');
          expect(res.status).to.equal(201);
          expect(res.body).to.have.keys('status', 'data');
          expect(res.body.status).to.deep.equals('success');
          expect(res.body.data).to.be.an('object');
          expect(res.body.data).to.have.keys('booking', 'request');
          expect(res.body.data.request).to.be.an('object');
          expect(res.body.data.booking).to.be.an('object');
          expect(res.body.data.first_name).to.equal(token.first_name);
          expect(res.body.data.last_name).to.equal(token.last_name);
          expect(res.body.data.email).to.equal(token.email);
          done();
        });
    });
    it('it should return token not found error', (done) => {
      chai
        .request(app)
        .post('/api/v1/request/multi-city')
        .send(requestData)
        .end((err, res) => {
          expect(res).to.be.an('object');
          expect(res.status).to.equal(401);
          expect(res.body).to.have.keys('status', 'error');
          expect(res.body.status).to.deep.equals('error');
          expect(res.body.error).to.deep.equals('No token provided!');
          done();
        });
    });
    it('it should return invalid token error', (done) => {
      chai
        .request(app)
        .post('/api/v1/request/multi-city')
        .send(requestData)
        .set('authorization', 'kklsdjjadjflkjdakljafsdgkjjgsdlkjasfdklj')
        .end((err, res) => {
          expect(res).to.be.an('object');
          expect(res.status).to.equal(401);
          expect(res.body).to.have.keys('status', 'error');
          expect(res.body.status).to.deep.equals('error');
          expect(res.body.error).to.deep.equals(
            'Invalid authentication token.'
          );
          done();
        });
    });
    it('fakes server error', (done) => {
      const req = { body: {} };
      const res = {
        status() { },
        send() { }
      };
      sinon.stub(res, 'status').returnsThis();
      RequestController.createMultiCityRequest(req, res);
      (res.status).should.have.callCount(1);
      done();
    });
  });
});
