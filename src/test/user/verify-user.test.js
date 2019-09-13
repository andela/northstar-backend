import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import Sinonchai from 'sinon-chai';
import app from '../../index';
import UsersController from '../../controllers/user.controller';

chai.use(chaiHttp);
chai.use(Sinonchai);
const { expect } = chai;
let userToken;

const user = {
  email: 'jane_doe@email.com',
  password: 'asdfghjkl'
};

before((done) => {
  chai.request(app)
    .post('/api/v1/auth/signin')
    .send(user)
    .end((err, res) => {
      userToken = res.body.data.token;
      done();
    });
});

describe('Verify User', () => {
  // Test for verifying user
  describe('/Verify an existing', () => {
    it('it should verify a user', (done) => {
      chai.request(app)
        .get(`/api/v1/auth/verification/${userToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.keys('status', 'data');
          expect(res.body.status).to.equal('success');
          expect(res.body.data).to.be.an('object');
          expect(res.body.data).to.not.have.key('is_verified');
          done();
        });
    });

    it('fakes server error for Verification', (done) => {
      const req = { body: {} };
      const res = {
        status() { },
        send() { }
      };

      sinon.stub(res, 'status').returnsThis();

      UsersController.verifyUser(req, res);
      res.status.should.have.callCount(1);
      done();
    });
  });
});
