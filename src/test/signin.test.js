import chai from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcrypt';

import models from '../db/models';
import app from '../index';

chai.use(chaiHttp);

const { expect } = chai;
const signinUrl = '/api/v1/auth/signin';
const { User } = models;

const testUserDetails = {
  first_name: 'Olawumi',
  last_name: 'Yusuff',
  email: 'user@test.com',
  password: '12345678'
};
let testUser;


before((done) => {
  bcrypt.hash(testUserDetails.password, 10)
    .then((hash) => User.create({
      first_name: testUserDetails.first_name,
      last_name: testUserDetails.last_name,
      email: testUserDetails.email,
      password: hash
    }))
    .then((user) => {
      testUser = user;
      done();
    })
    .catch((e) => done(e));
});

after((done) => {
  User.destroy({
    where: {
      email: testUserDetails.email
    }
  })
    .then(() => done())
    .catch((e) => done(e));
});

describe(`POST ${signinUrl}`, () => {
  describe('SUCCESS', () => {
    it('should sign in a user successfully', async () => {
      const res = await chai.request(app)
        .post(signinUrl)
        .send({
          email: testUserDetails.email,
          password: testUserDetails.password
        });

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.keys('status', 'data');
      expect(res.body.status).to.equal('success');
      expect(res.body.data).to.be.an('object');
      expect(res.body.data).to.not.have.key('password');
      expect(res.body.data).to.have.keys('role', 'is_verified', 'id',
        'first_name', 'last_name', 'email', 'updatedAt', 'manager_id',
        'createdAt', 'gender', 'birth_date', 'preferred_language',
        'preferred_currency', 'location', 'token', 'email_notification');
      expect(res.body.data.token).to.be.a('string');
      expect(res.body.data.role).to.equal(testUser.role);
      expect(res.body.data.isVerified).to.equal(testUser.isVerified);
      expect(res.body.data.id).to.equal(testUser.id);
      expect(res.body.data.first_name).to.equal(testUser.first_name);
      expect(res.body.data.last_name).to.equal(testUser.last_name);
      expect(res.body.data.email).to.equal(testUser.email);
      expect(res.body.data.email_notification).to.equal(testUser.email_notification);
      expect(res.body.data.manager_id).to.equal(testUser.manager_id);
      expect(res.body.data.gender).to.equal(testUser.gender);
      expect(res.body.data.preferred_language).to.equal(testUser.preferred_language);
      expect(res.body.data.preferred_currency).to.equal(testUser.preferred_currency);
      expect(res.body.data.location).to.equal(testUser.location);
    });
  });

  describe('FAILURE', () => {
    it('should fail to sign in user with incorrect email', async () => {
      const res = await chai.request(app)
        .post(signinUrl)
        .send({ email: 'another@example.com', password: testUserDetails.password });

      expect(res.status).to.equal(401);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.be.an('object');
      expect(res.body.error).to.have.property('message');
      expect(res.body.error.message).to.equal('Incorrect email or password');
    });

    it('should fail to sign in user with no email field in request', async () => {
      const res = await chai.request(app)
        .post(signinUrl)
        .send({ password: testUserDetails.password });

      expect(res.status).to.equal(401);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.be.an('object');
      expect(res.body.error).to.have.property('message');
      expect(res.body.error.message).to.equal('Incorrect email or password');
    });

    it('should fail to sign in user with empty email string', async () => {
      const res = await chai.request(app)
        .post(signinUrl)
        .send({ email: '', password: testUserDetails.password });

      expect(res.status).to.equal(401);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.be.an('object');
      expect(res.body.error).to.have.property('message');
      expect(res.body.error.message).to.equal('Incorrect email or password');
    });

    it('should fail to sign in user with non-string email', async () => {
      const res = await chai.request(app)
        .post(signinUrl)
        .send({ email: 10, password: testUserDetails.password });

      expect(res.status).to.equal(401);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.be.an('object');
      expect(res.body.error).to.have.property('message');
      expect(res.body.error.message).to.equal('Incorrect email or password');
    });

    it('should fail to sign in user with invalid email format', async () => {
      const res = await chai.request(app)
        .post(signinUrl)
        .send({ email: 'user@example', password: testUserDetails.password });

      expect(res.status).to.equal(401);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.be.an('object');
      expect(res.body.error).to.have.property('message');
      expect(res.body.error.message).to.equal('Incorrect email or password');
    });

    it('should fail to sign in user with incorrect password', async () => {
      const res = await chai.request(app)
        .post(signinUrl)
        .send({ email: testUserDetails.email, password: 'emi naa ni' });

      expect(res.status).to.equal(401);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.be.an('object');
      expect(res.body.error).to.have.property('message');
      expect(res.body.error.message).to.equal('Incorrect email or password');
    });

    it('should fail to sign in user with no password field supplied', async () => {
      const res = await chai.request(app)
        .post(signinUrl)
        .send({ email: testUserDetails.email });

      expect(res.status).to.equal(401);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.be.an('object');
      expect(res.body.error).to.have.property('message');
      expect(res.body.error.message).to.equal('Incorrect email or password');
    });

    it('should fail to sign in user with empty password string', async () => {
      const res = await chai.request(app)
        .post(signinUrl)
        .send({ email: testUserDetails.email, password: '' });

      expect(res.status).to.equal(401);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.be.an('object');
      expect(res.body.error).to.have.property('message');
      expect(res.body.error.message).to.equal('Incorrect email or password');
    });

    it('should fail to sign in user with non-string password', async () => {
      const res = await chai.request(app)
        .post(signinUrl)
        .send({ email: testUserDetails.email, password: 10 });

      expect(res.status).to.equal(401);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.be.an('object');
      expect(res.body.error).to.have.property('message');
      expect(res.body.error.message).to.equal('Incorrect email or password');
    });

    it('should fail to sign in user with a too short password', async () => {
      const res = await chai.request(app)
        .post(signinUrl)
        .send({ email: testUserDetails, password: testUserDetails.password.slice(0, 6) });

      expect(res.status).to.equal(401);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('status');
      expect(res.body.status).to.equal('error');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.be.an('object');
      expect(res.body.error).to.have.property('message');
      expect(res.body.error.message).to.equal('Incorrect email or password');
    });
  });
});
