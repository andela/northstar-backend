import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import Sinonchai from 'sinon-chai';
import bcrypt from 'bcrypt';
import app from '../index';
import models from '../db/models';

import RequestController from '../controllers/request.controller';

chai.use(Sinonchai);
chai.use(chaiHttp);
chai.should();

const { expect } = chai;
const { User } = models;

const newUser = {
  first_name: 'Chidi',
  last_name: 'Emenike',
  email: 'chinonso@gmail.com',
  password: 'password123'
};

let testUser;
let adminToken;
const wrongToken = 'TY3MTE4NzEzLCJleHAiOjE1Njc3MjM1MTN9.zjTooik6NGz258I67aIMri4ML78w2pHprL7dVmPwg';

const manager = {
  email: 'superadmin@barefootnomad.com',
  password: 'superadmin'
};

before((done) => {
  bcrypt.hash(newUser.password, 10)
    .then((hash) => User.create({
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
      password: hash
    }))
    .then((user) => {
      testUser = user;
      done();
    })
    .catch((e) => done(e));
  chai
    .request(app)
    .post('/api/v1/auth/signin')
    .send(manager)
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.an('object');
      res.body.should.have.property('status').eql('success');
      res.body.should.have.property('data');
      res.body.data.should.have.property('token');
      adminToken = res.body.data.token;
    });
});

after((done) => {
  User.destroy({
    where: {
      email: newUser.email
    }
  })
    .then(() => done())
    .catch((e) => done(e));
});

describe('REQUESTS', () => {
  // Test for rejecting a request
  describe('/PATCH Reject a user\'s Request', () => {
    it('it should return unauthorized if user is not logged in', (done) => {
      chai.request(app)
        .patch('/api/v1/request/1')
        .end((error, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          res.body.should.have.property('error').eql('No token provided!');
          done();
        });
    });

    it('it should return error if user trying to login does not exist', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send({ email: 'chinwe@getMaxListeners.com', password: 'emeka@98glob' })
        .end((error, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          done();
        });
    });

    it('it should return an error if user is not an admin or manager', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: newUser.email,
          password: newUser.password
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('data');
          res.body.data.should.have.property('token');
          expect(res.body.data.first_name).to.equal(testUser.first_name);
          expect(res.body.data.last_name).to.equal(testUser.last_name);
          expect(res.body.data.email).to.equal(testUser.email);
          const { token } = res.body.data;

          chai.request(app)
            .patch('/api/v1/request/2')
            .set('x-access-token', token)
            .end((error, data) => {
              data.should.have.status(401);
              data.body.should.have.property('status').eql('error');
              data.body.should.have.property('error').eql('Hi! You are not permitted to perform this action');
              done();
            });
        });
    });

    it('it should return an error if no token is provided', (done) => {
      chai.request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: newUser.email,
          password: newUser.password
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('data');
          res.body.data.should.have.property('token');
          expect(res.body.data.first_name).to.equal(testUser.first_name);
          expect(res.body.data.last_name).to.equal(testUser.last_name);
          expect(res.body.data.email).to.equal(testUser.email);

          chai.request(app)
            .patch('/api/v1/request/2')
            .end((error, data) => {
              data.should.have.status(401);
              data.body.should.be.an('object');
              data.body.should.have.property('status').eql('error');
              data.body.should.have.property('error').eql('No token provided!');
              done();
            });
        });
    });

    it('it should return invalid id if id of the request is not a number', (done) => {
      chai
        .request(app)
        .patch('/api/v1/request/p')
        .set('token', adminToken)
        .end((error, data) => {
          data.should.have.status(422);
          data.body.should.be.an('object');
          data.body.should.have.property('status').eql('error');
          data.body.should.have.property('error').eql('This id is invalid. ID must be a number!');
          done();
        });
    });

    it('it should return an error if a request does not exist', (done) => {
      chai
        .request(app)
        .patch('/api/v1/request/10')
        .set('x-access-token', adminToken)
        .end((error, data) => {
          data.should.have.status(404);
          data.body.should.have.property('status').eql('error');
          data.body.should.have.property('error').eql('This request does not exist');
          done();
        });
    });

    it('it should fail to authenticate incorrect token', (done) => {
      chai
        .request(app)
        .patch('/api/v1/request/1')
        .set('x-access-token', wrongToken)
        .end((error, data) => {
          data.should.have.status(401);
          data.body.should.have.property('status').eql('error');
          data.body.should.have.property('error').eql('Failed to authenticate token.');
          done();
        });
    });

    it('it should login and allow a manager to reject a user\'s request', (done) => {
      chai.request(app)
        .patch('/api/v1/request/1')
        .set('authorization', adminToken)
        .end((error, data) => {
          data.should.have.status(201);
          data.body.should.have.property('status').eql('success');
          data.body.should.have.property('data');
          data.body.data.should.be.an('object');
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

      RequestController.rejectRequest(req, res);
      (res.status).should.have.callCount(1);
      done();
    });
  });
});


const requestEndpoint = '/api/v1/requests';
const loginEndpoint = '/api/v1/auth/signin';

// lets signin the user first.
const user = {
  email: 'john_doe@email.com',
  password: 'qwertyuiop'
};

describe('/GET REQUESTS', () => {

  it('should login and return the token', (done) => {
    chai.request(app)
      .post(loginEndpoint)
      .send(user)
      .end((err, res) => {
        user.token = res.body.data.token;
        res.should.have.status(200);
        done();
      })
  });

  // now for the main tests //
  it('should ask for token if there is none', (done) => {
    chai.request(app)
      .get(requestEndpoint)
      .set('Authorization', '')
      .end((err, res) => {
        res.should.have.status(403);
        done();
      })
  });

  it('should return 200 if requests are found', (done) => {
    const validToken = `Bearer ${user.token}`;
    chai.request(app)
      .get(requestEndpoint)
      .set('Authorization', validToken)
      .end((err, res) => {
        res.should.have.status(200);
        res.headers['content-type'].should.contain('application/json');
        done();
      })
  });

  it('return error if token is invalid/expired', (done) => {
    const invalidToken = `Bearer 000!!000xx0##^&##${user.token}xx000xxx000xxx0000`;
    chai.request(app)
      .get(requestEndpoint)
      .set('Authorization', invalidToken)
      .end((err, res) => {
        res.should.have.status(400);
        res.headers['content-type'].should.contain('application/json');
        done();
      })
  });

  it('return failure on nonexistent route v1', (done) => {
    chai.request(app)
      .get(`${requestEndpoint}nonexistent`)
      .end((err, res) => {
        res.should.have.status(404);
        res.headers['content-type'].should.contain('application/json');
        done();
      })
  });

  it('fakes server error on request controller', (done) => {
    const req = { body: {} };
    const res = {
      status() { },
      send() { }
    };

    sinon.stub(res, 'status').returnsThis();

    RequestController.findAll(req, res);
    (res.status).should.have.callCount(0);
    done();
  });
});

describe('Requests', () => {
  let token;
  before('signup to get access userToken', async () => {
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
      location: 'lagos',
    };
    const userRes = await chai.request(app)
      .post('/api/v1/auth/signup')
      .send(user);
    token = userRes.body.data.token;
  });
  describe('/POST multi city request', () => {
    const requestData = {
      "category": "multi-city",
      "origin": "Lagos Nigeria",
      "destination": "Kigali, Rwanda, london",
      "departure_date": "12-20-2019",
      "return_date": "12-20-2019",
      "reason": "Duty calls",
      "room_id": 2
    }
    it('it should successfully create a multy city request trip', (done) => {
      chai.request(app)
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
      chai.request(app)
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
      chai.request(app)
        .post('/api/v1/request/multi-city')
        .send(requestData)
        .set('authorization', 'kklsdjjadjflkjdakljafsdgkjjgsdlkjasfdklj')
        .end((err, res) => {
          expect(res).to.be.an('object');
          expect(res.status).to.equal(401);
          expect(res.body).to.have.keys('status', 'error');
          expect(res.body.status).to.deep.equals('error');
          expect(res.body.error).to.deep.equals('Failed to authenticate token.');
          done();
        });
    });
  });

});
