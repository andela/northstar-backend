import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import Sinonchai from 'sinon-chai';

import Auth from '../middlewares/auth';

chai.use(Sinonchai);
chai.use(chaiHttp);

describe('/Auth Middlewares', () => {
  // Test the middle wares for internal server errors
  it('fakes server error on verifyUserToken', (done) => {
    const req = { body: {} };
    const res = {
      status() { },
      send() { }
    };
    sinon.stub(res, 'status').returnsThis();
    Auth.verifyUserToken(req, res);
    (res.status).should.have.callCount(1);
    done();
  });

  it('fakes server error on verifyManager', (done) => {
    const req = { body: {} };
    const res = {
      status() {},
      send() {}
    };
    sinon.stub(res, 'status').returnsThis();
    Auth.verifyManager(req, res);
    res.status.should.have.callCount(1);
    done();
  });

  it('fakes server error on verifyTravelAdmin', (done) => {
    const req = { body: {} };
    const res = {
      status() { },
      send() { }
    };
    sinon.stub(res, 'status').returnsThis();
    Auth.verifyTravelAdmin(req, res);
    res.status.should.have.callCount(1);
    done();
  });
});
