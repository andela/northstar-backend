import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import UsersController from "../controllers/user.controller";
import Auth from "../middlewares/auth";
import sinon from "sinon";
import Sinonchai from "sinon-chai";

chai.use(chaiHttp);
chai.should();
chai.use(Sinonchai);

const user = {
  email: 'chiomadans@gmail.com',
  first_name: 'Ejike',
  last_name: 'Chiemerie',
  password: 'secret123',
  role: 'requester',
  gender: 'female',
  birth_date: '02-02-2019',
  preferred_language: 'english',
  preferred_currency: 'USD',
  location: 'lagos',
};

describe('Users', () => {
    // Test for creating new user
    describe('/POST register users', () => {
        it('it should Signup a user and generate a token', (done) => {
            chai.request(app)
                .post('/api/v1/auth/signup')
                .send(user)
                .end((err, res) => {
                    user.token = res.body.data.token;
                    res.should.have.status(201);
                    res.body.should.be.an('object');
                    res.body.should.have.property('status').eql('success');
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('first_name');
                    res.body.data.should.have.property('last_name');
                    res.body.data.should.have.property('email');
                    done();
                });
        });
    });

    describe('/GET Requests', () => {
        it('should return 404 on zero requests found', (done) => {
            const validToken = `Bearer ${user.token}`;
            chai.request(app)
                .get('/api/v1/requests')
                .set('Authorization', validToken)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                })
        });

        it('fakes server error', (done) => {
            const req = { body: {} };
            const res = {
                status() { },
                send() { }
            };

            sinon.stub(res, 'status').returnsThis();

            UsersController.signup(req, res);
            (res.status).should.have.callCount(0);
            done();
        });

        it("fakes server error", done => {
            const req = { body: {} };
            const res = {
                status() { },
                send() { }
            };

            sinon.stub(res, "status").returnsThis();

            UsersController.signin(req, res);
            res.status.should.have.callCount(0);
            done();
        });

        it("fakes server error", done => {
          const req = { body: {} };
          const res = {
            status() {},
            send() {}
          };

          sinon.stub(res, "status").returnsThis();

            Auth.verifyUserToken(req, res);
          res.status.should.have.callCount(1);
          done();
        });

        it("fakes server error", done => {
            const req = { body: {} };
            const res = {
                status() { },
                send() { }
            };

            sinon.stub(res, "status").returnsThis();

            Auth.verifyManager(req, res);
            res.status.should.have.callCount(1);
            done();
        });

        it("fakes server error", done => {
            const req = { body: {} };
            const res = {
                status() { },
                send() { }
            };

            sinon.stub(res, "status").returnsThis();

            Auth.verifyTravelAdmin(req, res);
            res.status.should.have.callCount(1);
            done();
        });
    });
});
