import chai from "chai";
import chaiHttp from 'chai-http';
import app from '../../index'
import FacilitiesController from "../../controllers/facilities.controller";
import sinon from "sinon";
import Sinonchai from "sinon-chai";

chai.use(chaiHttp);
chai.should();
chai.use(Sinonchai);

const route = '/api/v1/facilities/1/like'
let userToken;
const user = {
  email: "jane_doe@email.com",
  password: "asdfghjkl"
};

before("signin to get access userToken", async () => {
  const userRes = await chai
    .request(app)
    .post("/api/v1/auth/signin")
    .send(user);
  userToken = userRes.body.data.token;
});

describe('FACILITIES/LIKES', () => {
// Users can like or unlike a facility
  describe('/POST Users can like an accomodation facility', () => {
    it('It Should Successfully like a facility', (done) => {
      chai.request(app)
        .post(route)
        .set('x-access-token', userToken)
        .end((error, data) => {
          data.should.have.status(201);
          data.body.should.have.property('status').eql('success');
          data.body.should.have.property('data');
          data.body.data.should.be.an('object');
          done();
        });
    });

    it('It Should Successfully unlike a facility when you try to like twice', (done) => {
      chai.request(app)
        .post(route)
        .set('authorization', userToken)
        .end((error, data) => {
          data.should.have.status(200);
          data.body.should.have.property('status').eql('success');
          data.body.should.have.property('data');
          data.body.data.should.be.an('object');
          done();
        });
    });

    it('fakes server error', done => {
      const req = { body: {} };
      const res = {
        status() { },
        send() { }
      };
      sinon.stub(res, "status").returnsThis();
      FacilitiesController.likeOrUnlikeFacility(req, res);
      res.status.should.have.callCount(1);
      done();
    });
  });
});
