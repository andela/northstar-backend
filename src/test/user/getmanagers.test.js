import chai from 'chai';
import app from '../../index';
import JWTService from '../../services/jwt.service';
import sinon from 'sinon';
import Sinonchai from 'sinon-chai';

import UserController from '../../controllers/user.controller';


chai.should();
chai.use(Sinonchai);

describe('Managers', () => {
  // Test for getting all managers
  describe('/get all managers', () => {
    it('should be able to retrieve list of managers when an authorize user makes a request', (done) => {
      chai.request(app)
        .get('/api/v1/managers')
        .set('token', JWTService.generateToken({ id: 1, role: 'requester' }))
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('data');          
          done();
        });
    });
  });
  // Test for getting all managers
  describe('/get all managers', () => {
    it('Should not be able to retrieve managers for a request if the user is not logged in', (done) => {
      chai.request(app)
        .get('/api/v1/managers')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          done();
        });
    });
  });
  describe('get all managers', () => {
    it('Should not be able to retrieve managers for a request if the user supplies invalid token', (done) => {
      chai.request(app)
        .get('/api/v1/managers')
        .set('token', '24jh3bchjbeureu3f33')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          done();
        });
    });
  });
  describe('get all managers', () => {
    it('fakes server error', (done) => {
      const req = { body: {} };
      const res = {
          status() {},
          send() {}
      };
  
      sinon.stub(res, 'status').returnsThis();
  
      UserController.getManagers(req, res);
    //   (res.status).should.have.callCount(1);
      done();
    });
  });
  
});