import chai from 'chai';
import chaiHttp from 'chai-http';
import sgMail from '@sendgrid/mail';
import sinon from 'sinon';

import app from '../index';


chai.use(chaiHttp);
const { expect } = chai;

const authBase = '/api/v1/auth';

describe('SOCIAL AUTHENTICATION', () => {
  describe('SUCCESS', () => {
    it('should save a google user into the database', async () => {
      const stub = sinon.stub(sgMail, 'send').callsFake((msg) => 'done');
      const res = await chai.request(app)
        .post(`${authBase}/google`)
        .send({ provider: 'google' });

      expect(res.status).to.equal(201);
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
      expect(res.body.data.role).to.equal('requester');
      expect(res.body.data.id).to.be.a('number');
      expect(res.body.data.first_name).to.not.equal(null);
      expect(res.body.data.last_name).to.not.equal(null);
      expect(res.body.data.email).to.not.equal(null);
      expect(res.body.data.email).to.be.a('string');
      expect(stub.called).to.equal(true);
      stub.restore();
    });

    it('should save a facebook user into the database', async () => {
      const res = await chai.request(app)
        .post(`${authBase}/facebook`)
        .send({ provider: 'facebook' });

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
      expect(res.body.data.role).to.equal('requester');
      expect(res.body.data.id).to.be.a('number');
      expect(res.body.data.first_name).to.not.equal(null);
      expect(res.body.data.last_name).to.not.equal(null);
      expect(res.body.data.email).to.not.equal(null);
      expect(res.body.data.email).to.be.a('string');
    });
  });

  describe('FAILURE', () => {
    it('should fail to sign in a google user without email', async () => {
      const res = await chai.request(app)
        .post(`${authBase}/google`)
        .send({ provider: 'google_fail' });

      expect(res.status).to.equal(401);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.be.an('object');
      expect(res.body.error).to.have.property('message');
      expect(res.body.error.message).to.equal('Unable to sign in');
    });

    it('should fail to sign in a google user without email', async () => {
      const res = await chai.request(app)
        .post(`${authBase}/facebook`)
        .send({ provider: 'facebook_fail' });

      expect(res.status).to.equal(401);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('error');
      expect(res.body.error).to.be.an('object');
      expect(res.body.error).to.have.property('message');
      expect(res.body.error.message).to.equal('Unable to sign in');
    });
  });
});
