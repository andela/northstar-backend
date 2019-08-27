import chai from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcrypt';
import app from '../index';
import models from '../db/models';

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
        .patch('/api/v1/requests/1')
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
            .patch('/api/v1/requests/2')
            .set('x-access-token', token)
            .end((error, data) => {
              data.should.have.status(401);
              data.body.should.be.an('object');
              done();
            });
        });
    });

    it('it should return invalid id if id of the request is not a number', (done) => {
      chai
        .request(app)
        .patch('/api/v1/requests/p')
        .set('x-access-token', adminToken)
        .end((error, data) => {
          data.should.have.status(400);
          data.body.should.be.an('object');
          data.body.should.have.property('status').eql('error');
          data.body.should.have.property('error').eql('This id is invalid. ID must be a number!');
          done();
        });
    });
    it('it should return an error if a request does not exist', (done) => {
      chai
        .request(app)
        .patch('/api/v1/requests/10')
        .set('x-access-token', adminToken)
        .end((error, data) => {
          data.should.have.status(404);
          data.body.should.be.an('object');
          data.body.should.have.property('status').eql('error');
          data.body.should.have.property('error').eql('This request does not exist');
          done();
        });
    });

    it('it should login and allow a manager to reject a user\'s request', (done) => {
      chai.request(app)
        .patch('/api/v1/requests/1')
        .set('x-access-token', adminToken)
        .end((error, data) => {
          data.should.have.status(201);
          data.body.should.be.an('object');
          data.body.should.have.property('status').eql('success');
          data.body.should.have.property('data');
          done();
        });
    });
  });
});
