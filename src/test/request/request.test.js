import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import Sinonchai from 'sinon-chai';
import bcrypt from 'bcrypt';
import MockDate from 'mockdate';

import app from '../../index';
import models from '../../db/models';
import Response from '../../utils/response.utils';

import RequestController from '../../controllers/request.controller';

chai.use(Sinonchai);
chai.use(chaiHttp);
chai.should();

const { expect } = chai;
const { User, Request } = models;

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
        .patch('/api/v1/requests/decline/1')
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
            .patch('/api/v1/requests/decline/2')
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
            .patch('/api/v1/requests/decline/2')
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
        .patch('/api/v1/requests/decline/p')
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
        .patch('/api/v1/requests/decline/10')
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
        .patch('/api/v1/requests/decline/1')
        .set('x-access-token', wrongToken)
        .end((error, data) => {
          data.should.have.status(401);
          data.body.should.have.property('status').eql('error');
          data.body.should.have.property('error').eql('Invalid authentication token.');
          done();
        });
    });

    it('it should login and allow a manager to reject a user\'s request', (done) => {
      chai.request(app)
        .patch('/api/v1/requests/decline/1')
        .set('authorization', adminToken)
        .end((error, data) => {
          data.should.have.status(201);
          data.body.should.have.property('status').eql('success');
          data.body.should.have.property('data');
          data.body.data.should.be.an('object');
          done();
        });
    });

    it('fakes server error for reject request', (done) => {
      const req = { body: {} };
      const res = {
        status() {},
        send() {}
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

const user2 = {
  email: 'h.milan@email.com',
  password: 'milanogelato'
};



const newRequest = {
  category: 'one-way',
  origin: 'Lagos',
  destination: 'Abuja',
  departure_date: new Date(),
  reason: 'For the fun of it',
  booking_id: 1
};

const newRequest2 = {
  category: 'round-trip',
  origin: 'Lagos',
  destination: ['Abuja', 'Onitsha'],
  departure_date: '2019-9-30',
  return_date: '2019-10-30',
  reason: 'For the fun of it',
  booking_id: 1
};

const newRequest3 = {
  category: 'round-trip',
  origin: 'Lagos',
  destination: ['Abuja', 'Onitsha'],
  departure_date: '2019-9-30',
  return_date: '2019-9-30',
  reason: 'For the fun of it',
  booking_id: ''
};

const newRequest4 = {
  category: 'round-trip',
  origin: 'Lagos',
  destination: ['Abuja', 'Onitsha'],
  departure_date: '2019-9-30',
  return_date: '2019-9-30',
  reason: 'For the fun of it',
  booking_id: '2654'
};

const newRequest5 = {
  category: 'round-trip',
  origin: 'Lagos',
  destination: ['Abuja','Onitsha'],
  departure_date: '2019-09-29',
  return_date:'2019-10-30',
  reason: 'For the fun of it'
};

const newRequest6 = {
  category: 'one-way',
  origin: 'Lagos',
  destination: ['Abuja'],
  departure_date: '2019-09-29',
  return_date:'2019-10-30',
  reason: 'For the fun of it',
  booking_id: '1'
};

const newRequest7 = {
  category: 'one-way',
  origin: 'Lagos',
  destination: ['Abuja','Onitsha'],
  departure_date: '2019-09-29',
  reason: 'For the fun of it',
  booking_id: '1'
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
      });
  });

  it('should login and return the token', (done) => {
    chai.request(app)
      .post(loginEndpoint)
      .send(user2)
      .end((err, res) => {
        user2.token = res.body.data.token;
        res.should.have.status(200);
        done();
      });
  });

  // now for the main tests //

  it('should ask for token if there is none', (done) => {
    chai.request(app)
      .get(requestEndpoint)
      .set('Authorization', '')
      .end((err, res) => {
        res.should.have.status(403);
        done();
      });
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
      });
  });


  it('return 400 on invalid/expired token', (done) => {
    const invalidToken = `Bearer 000!!000xx0##^&##${user.token}xx000xxx000xxx0000`;
    chai.request(app)
      .get(requestEndpoint)
      .set('Authorization', invalidToken)
      .end((err, res) => {
        res.should.have.status(400);
        res.headers['content-type'].should.contain('application/json');
        done();
      });
  });

  it('return failure on nonexistent route v1', (done) => {
    chai.request(app)
      .get(`${requestEndpoint}nonexistent`)
      .end((err, res) => {
        res.should.have.status(404);
        res.headers['content-type'].should.contain('application/json');
        done();
      });
  });

  it('fakes server error on request controller', (done) => {
    const req = { body: {} };
    const res = {
      status() {},
      send() {}
    };

    sinon.stub(res, 'status').returnsThis();

    RequestController.findAll(req, res);
    (res.status).should.have.callCount(1);
    done();
  });
});

describe('/POST REQUESTS', () => {
  it('should return 403 without a token', (done) => {
    chai.request(app)
      .post(requestEndpoint)
      .set('Authorization', '')
      .send(newRequest)
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.be.an('object');
        res.body.should.have.property('status').eql('error');
        done();
      });
  });

  it('should return 400 on invalid/expired token', (done) => {
    chai.request(app)
      .post(requestEndpoint)
      .set('Authorization', 'Bearer 000!!000xx0##^&##x000xxx000xxx0000')
      .send(newRequest)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('status').eql('error');
        done();
      });
  });

  it('should return 201 with valid request data', (done) => {
    chai.request(app)
      .post(requestEndpoint)
      .set('Authorization', `Bearer ${user.token}`)
      .send(newRequest)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.an('object');
        res.body.should.have.property('status').eql('success');
        res.body.data.should.have.property('id');
        done();
      });
  });

  it('should return 500 with nonexistent booking ID', (done) => {
    newRequest.booking_id = 100000;
    chai.request(app)
      .post(requestEndpoint)
      .set('Authorization', `Bearer ${user.token}`)
      .send(newRequest)
      .end((err, res) => {
        res.should.have.status(500);
        res.body.should.be.an('object');
        res.body.should.have.property('status').eql('error');
        res.body.error.should.have.property('message');
        done();
      });
  });

  it('should return 400 with invalid request data', (done) => {
    newRequest.booking_id = '';
    delete newRequest.origin;
    chai.request(app)
      .post(requestEndpoint)
      .set('Authorization', `Bearer ${user.token}`)
      .send(newRequest)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('status').eql('error');
        done();
      });
  });

  it('should ensure return date not needed for one-way trips', (done) => {
    newRequest.return_date = new Date();
    chai.request(app)
      .post(requestEndpoint)
      .set('Authorization', `Bearer ${user.token}`)
      .send(newRequest)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('status').eql('error');
        done();
      });
  });

  it('should ensure category is set to one-way', (done) => {
    newRequest.category = 'many-ways';
    chai.request(app)
      .post(requestEndpoint)
      .set('Authorization', `Bearer ${user.token}`)
      .send(newRequest)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('status').eql('error');
        done();
      });
  });

  it('fakes server error for TripRequest', (done) => {
    const req = { body: {} };
    const res = {
      status() { },
      send() { }
    };

    sinon.stub(res, 'status').returnsThis();

    RequestController.TripRequests(req, res);
    (res.status).should.have.callCount(0);
    done();
  });

  it('fakes server error for TripRequest', (done) => {
    const req = { body: {} };
    const res = {
      status() { },
      send() { }
    };

    sinon.stub(res, 'status').returnsThis();

    RequestController.findAll(req, res);
    (res.status).should.have.callCount(1);
    done();
  });

  it('should create a round trip request', (done) => {
    chai.request(app)
      .post(requestEndpoint)
      .set('Authorization', `Bearer ${user.token}`)
      .send(newRequest2)
      .end((err, res) => {
        res.body.should.have.property('status').eql('success');
        res.body.data.should.have.property('status').eql('pending');
        res.body.data.should.have.property('origin').eql('Lagos');
        res.body.data.should.have.property('destination').eql(['abuja', 'onitsha']);
        res.body.data.should.have.property('departure_date');
        res.body.data.should.have.property('return_date');
        res.body.data.should.have.property('reason').eql('For the fun of it');
        res.body.data.should.have.property('booking_id').eql(1);
        done();
      });
  });

  it('should create a round trip request and set destination as an array', (done) => {
    chai.request(app)
      .post(requestEndpoint)
      .set('Authorization', `Bearer ${user.token}`)
      .send({ ...newRequest2, destination: "['sfo', 'la']" })
      .end((err, res) => {
        res.body.should.have.property('status').eql('success');
        res.body.data.should.have.property('status').eql('pending');
        res.body.data.should.have.property('origin').eql('Lagos');
        res.body.data.should.have.property('destination').eql(['sfo', 'la']);
        res.body.data.should.have.property('departure_date');
        res.body.data.should.have.property('return_date');
        res.body.data.should.have.property('reason').eql('For the fun of it');
        res.body.data.should.have.property('booking_id').eql(1);
        done();
      });
  });

  it('should return an error if booking_id does not exist', (done) => {
    chai.request(app)
      .post(requestEndpoint)
      .set('Authorization', `Bearer ${user.token}`)
      .send(newRequest3)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('status').eql('error');
        res.body.should.have.property('error').eql(['Booking ID is invalid']);
        done();
      });
  });

  it('should return 400 with nonexistent bookings', (done) => {
    chai.request(app)
      .post(requestEndpoint)
      .set('Authorization', `Bearer ${user.token}`)
      .send(newRequest4)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.be.an('object');
        res.body.should.have.property('status').eql('error');
        res.body.error.should.have.property('message').eql('No booking with this booking_id exists.');
        done();
      });
  });

  it('should call Response.customError for server error on createReturnTripRequest controller', (done) => {
    const req = { body: {} };
    const res = {
      status() {},
      send() {}
    };
    sinon.stub(Request, 'create').throws();
    const CustomErrorStub = sinon.stub(Response, 'CustomError').returnsThis();

    RequestController.createReturnTripRequest(req, res);
    (CustomErrorStub).should.have.callCount(1);
    sinon.restore();
    done();
  });
});

describe('/PATCH REQUESTS',() => {
  let oneWayRequestId;

  before((done) => {
    MockDate.set(new Date('2019-09-14'));

    chai
      .request(app)
      .post('/api/v1/requests')
      .set('Authorization', `Bearer ${user.token}`) 
      .send(newRequest7)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.an('object');
        res.body.should.have.property('status').eql('success');
        res.body.should.have.property('data');
        oneWayRequestId = res.body.data.id;

        done();
      });
  });

  after(() => {
    MockDate.reset();
  })

 it('should return 200 with valid updated round-trip request data', (done) => {
    chai.request(app)
      .patch(`${requestEndpoint}/11`)
      .set('Authorization', `Bearer ${user.token}`) 
      .send(newRequest5)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.an('object');
        res.body.should.have.property('status').eql('success');
        res.body.data.should.have.property('id');
        done();
      });
  });

  it('should update a one-way trip with departure date', (done) => {
    chai.request(app)
        .patch(`${requestEndpoint}/${oneWayRequestId}`)
        .set('Authorization', `Bearer ${user.token}`)
        .send({ departure_date: '2019-09-30' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.data.should.have.property('id');
          done();
        });
  });


  it('should not update a one-way trip with departure date of today', (done) => {
    chai.request(app)
        .patch(`${requestEndpoint}/${oneWayRequestId}`)
        .set('Authorization', `Bearer ${user.token}`)
        .send({ departure_date: '2019-09-14' })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          res.body.error.should.have.property('departure_date').eql('Departure date must be a date after today')
          done();
        });
  });

  it('should not update one-way trips with return_date in request body', (done) => {
    chai.request(app)
        .patch(`${requestEndpoint}/11`)
        .set('Authorization', `Bearer ${user.token}`) 
        .send(newRequest6)
        .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.an('object');
            res.body.should.have.property('status').eql('error');
            res.body.error.should.have.property('return_date').eql('Return date is not required for one-way trips')
            done();
        });
  });

it('should not update one-way trips with more than one destinations', (done) => {
  chai.request(app)
      .patch(`${requestEndpoint}/11`)
      .set('Authorization', `Bearer ${user.token}`) 
      .send(newRequest7)
      .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          res.body.error.should.have.property('destination').eql('One way trips can only have one destination');
          done();
      });
});

it('should not update a trip that sends in status', (done) => {
  chai.request(app)
      .patch(`${requestEndpoint}/11`)
      .set('Authorization', `Bearer ${user.token}`) 
      .send({ ...newRequest5, status: 'approved' })
      .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          res.body.error.should.have.property('status').eql('Status is not required');
          done();
      });
});

  it('should not update a request with invalid return_date', (done) => {
    chai.request(app)
      .patch(`${requestEndpoint}/11`)
      .set('Authorization', `Bearer ${user.token}`) 
      .send({ return_date: '09-28-2019' })
      .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          res.body.error.should.have.property('return_date').eql('Return date must be in the format YYYY-MM-DD' )
          done();
      });
  });

  it('should not update a round-trip request with return_date before today', (done) => {
    chai.request(app)
      .patch(`${requestEndpoint}/11`)
      .set('Authorization', `Bearer ${user.token}`) 
      .send({ return_date: '2019-09-08' })
      .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          res.body.error.should.have.property('return_date').eql('Return date must be a date after today' )
          done();
      });
  });


  it('should not update a round-trip request with return_date before departure_date', (done) => {
    chai.request(app)
      .patch(`${requestEndpoint}/11`)
      .set('Authorization', `Bearer ${user.token}`) 
      .send({ return_date: '2019-09-27', departure_date:  '2019-09-30' })
      .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          res.body.error.should.have.property('return_date').eql('Return date must be after departure date' )
          done();
      });
  });

  it('should not update a one-way request to a multi-city request if return_date is not provided', (done) => {
    chai.request(app)
      .patch(`${requestEndpoint}/${oneWayRequestId}`)
      .set('Authorization', `Bearer ${user.token}`) 
      .send({ departure_date:  '2019-09-27', category: 'multi-city' })
      .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          res.body.error.should.have.property('return_date').eql('Return date is required for multi-city trips' )
          done();
      });
  });

it('should not update a request that does not exists', (done) => {
  chai.request(app)
      .patch(`${requestEndpoint}/300`)
      .set('Authorization', `Bearer ${user.token}`) 
      .send(newRequest7)
      .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          res.body.should.have.property('error').eql('Request not found' )
          done();
      });
});

it('should not update a request with wrong user id', (done) => {
  chai.request(app)
      .patch(`${requestEndpoint}/3`)
      .set('Authorization', `Bearer ${user.token}`) 
      .send({ ...newRequest7, destination: 'Uyo' })
      .end((err, res) => {
        console.log(res.body)
          res.should.have.status(403);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          res.body.should.have.property('error').eql(' You cannot edit this request')
          done();
      });
});

it('should not update a request that is not pending', (done) => {
  chai.request(app)
      .patch(`${requestEndpoint}/1`)
      .set('Authorization', `Bearer ${user2.token}`) 
      .send(newRequest)
      .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          res.body.should.have.property('error').eql('You cannot update a request that is not pending')
          done();
      });
});

it('should call Response.customError for server error on editRequest controller', (done) => {
  const req = { body: {} };
  const res = {
    status() {},
    send() {}
  };
  sinon.stub(Request, 'update').throws();
  const CustomErrorStub = sinon.stub(Response, 'CustomError').returnsThis();

  RequestController.editRequest(req, res);
  (CustomErrorStub).should.have.callCount(1);
  sinon.restore();
  done();
});
});