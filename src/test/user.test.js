import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../index';
import userController from '../controllers/user.controller';

const { expect } = chai;
chai.use(chaiHttp);

let myToken;

before((done) => {
  chai.request(app)
    .post('/api/v1/auth/signin')
    .send({
      email: 'john_doe@email.com',
      password: 'qwertyuiop'
    })
    .end((err, res) => {
      myToken = res.body.data.token;
      done();
    });
});

describe('Update profile', () => {
  it('Should fake server error', (done) => {
    const req = { body: {} };
    const res = {
      status() {},
      send() {}
    };
    sinon.stub(res, 'status').returnsThis();
    userController.updateProfile(req, res);
    (res.status).should.have.callCount(0);
    done();
  });

  describe('Validation Errors', () => {
    it('Should send a 422 error if no value was provided to update', (done) => {
      chai.request(app)
        .patch('/api/v1/profile')
        .send({ noVal: 'value' })
        .set('Authorization', myToken)
        .end((error, res) => {
          expect(res).to.have.status(422);
          expect(res.body).to.have.keys('status', 'error');
          expect(res.body.status).to.deep.equal('error');
          expect(res.body.error).to.deep.equal('Supply values to update.');
          done();
        });
    });


    it('Should send a 422 error if first_name was provided but is empty', (done) => {
      chai.request(app)
        .patch('/api/v1/profile')
        .set('Authorization', myToken)
        .send({
          first_name: ''
        })
        .end((error, res) => {
          expect(res).to.have.status(422);
          expect(res.body).to.have.keys('status', 'error');
          expect(res.body.status).to.deep.equal('error');
          expect(res.body.error).deep.to.be.an('array');
          expect(res.body.error[0]).to.have.keys('field', 'message');
          expect(res.body.error[0].field).to.deep.equal('first_name');
          expect(res.body.error[0].message).to.deep.equal('Supply a first name consisting of letters only.');
          done();
        });
    });

    it('Should send a 422 error if first_name has invalid characters', (done) => {
      chai.request(app)
        .patch('/api/v1/profile')
        .set('Authorization', myToken)
        .send({
          first_name: '22ndnd'
        })
        .end((error, res) => {
          expect(res).to.have.status(422);
          expect(res.body).to.have.keys('status', 'error');
          expect(res.body.status).to.deep.equal('error');
          expect(res.body.error).deep.to.be.an('array');
          expect(res.body.error[0]).to.have.keys('field', 'message');
          expect(res.body.error[0].field).to.deep.equal('first_name');
          expect(res.body.error[0].message).to.deep.equal('Supply a first name consisting of letters only.');
          done();
        });
    });

    it('Should send a 422 error if last_name was provided but is empty', (done) => {
      chai.request(app)
        .patch('/api/v1/profile')
        .set('Authorization', myToken)
        .send({
          last_name: ''
        })
        .end((error, res) => {
          expect(res).to.have.status(422);
          expect(res.body).to.have.keys('status', 'error');
          expect(res.body.status).to.deep.equal('error');
          expect(res.body.error).deep.to.be.an('array');
          expect(res.body.error[0]).to.have.keys('field', 'message');
          expect(res.body.error[0].field).to.deep.equal('last_name');
          expect(res.body.error[0].message).to.deep.equal('Supply a last name consisting of alphabets only.');
          done();
        });
    });

    it('Should send a 422 error if last_name was provided and has invalid characters', (done) => {
      chai.request(app)
        .patch('/api/v1/profile')
        .set('Authorization', myToken)
        .send({
          last_name: '22ndnd'
        })
        .end((error, res) => {
          expect(res).to.have.status(422);
          expect(res.body).to.have.keys('status', 'error');
          expect(res.body.status).to.deep.equal('error');
          expect(res.body.error).deep.to.be.an('array');
          expect(res.body.error[0]).to.have.keys('field', 'message');
          expect(res.body.error[0].field).to.deep.equal('last_name');
          expect(res.body.error[0].message).to.deep.equal('Supply a last name consisting of alphabets only.');
          done();
        });
    });

    it('Should send a 422 error if gender field is empty', (done) => {
      chai.request(app)
        .patch('/api/v1/profile')
        .set('Authorization', myToken)
        .send({
          gender: ''
        })
        .end((error, res) => {
          expect(res).to.have.status(422);
          expect(res.body).to.have.keys('status', 'error');
          expect(res.body.status).to.deep.equal('error');
          expect(res.body.error).deep.to.be.an('array');
          expect(res.body.error[0]).to.have.keys('field', 'message');
          expect(res.body.error[0].field).to.deep.equal('gender');
          expect(res.body.error[0].message).to.deep.equal('Gender should either be "male", "female" or "other".');
          done();
        });
    });

    it('Should send a 422 error if gender field is neither "male", "female" or "other', (done) => {
      chai.request(app)
        .patch('/api/v1/profile')
        .set('Authorization', myToken)
        .send({
          gender: 'fluid'
        })
        .end((error, res) => {
          expect(res).to.have.status(422);
          expect(res.body).to.have.keys('status', 'error');
          expect(res.body.status).to.deep.equal('error');
          expect(res.body.error).deep.to.be.an('array');
          expect(res.body.error[0]).to.have.keys('field', 'message');
          expect(res.body.error[0].field).to.deep.equal('gender');
          expect(res.body.error[0].message).to.deep.equal('Gender should either be "male", "female" or "other".');
          done();
        });
    });

    it('Should send a 422 error if birth_date field is invalid', (done) => {
      chai.request(app)
        .patch('/api/v1/profile')
        .set('Authorization', myToken)
        .send({
          birth_date: 'gdhsjs'
        })
        .end((error, res) => {
          expect(res).to.have.status(422);
          expect(res.body).to.have.keys('status', 'error');
          expect(res.body.status).to.deep.equal('error');
          expect(res.body.error).deep.to.be.an('array');
          expect(res.body.error[0]).to.have.keys('field', 'message');
          expect(res.body.error[0].field).to.deep.equal('birth_date');
          expect(res.body.error[0].message).to.deep.equal('Invalid date.');
          done();
        });
    });

    it('Should send a 422 error if preferred_currency field is invalid', (done) => {
      chai.request(app)
        .patch('/api/v1/profile')
        .set('Authorization', myToken)
        .send({
          preferred_currency: 'gdhsjs'
        })
        .end((error, res) => {
          expect(res).to.have.status(422);
          expect(res.body).to.have.keys('status', 'error');
          expect(res.body.status).to.deep.equal('error');
          expect(res.body.error).deep.to.be.an('array');
          expect(res.body.error[0]).to.have.keys('field', 'message');
          expect(res.body.error[0].field).to.deep.equal('preferred_currency');
          expect(res.body.error[0].message).to.deep.equal('Currency can either be "NGN", "USD", "GBP", "EUR" or "YEN".');
          done();
        });
    });

    it('Should send a 422 error if preferred_language field is invalid', (done) => {
      chai.request(app)
        .patch('/api/v1/profile')
        .set('Authorization', myToken)
        .send({
          preferred_language: '3gdhsjs'
        })
        .end((error, res) => {
          expect(res).to.have.status(422);
          expect(res.body).to.have.keys('status', 'error');
          expect(res.body.status).to.deep.equal('error');
          expect(res.body.error).deep.to.be.an('array');
          expect(res.body.error[0]).to.have.keys('field', 'message');
          expect(res.body.error[0].field).to.deep.equal('preferred_language');
          expect(res.body.error[0].message).to.deep.equal('Numbers and special characters are not allowed.');
          done();
        });
    });

    it('Should send a 422 error if location field is invalid', (done) => {
      chai.request(app)
        .patch('/api/v1/profile')
        .set('Authorization', myToken)
        .send({
          location: 'gdhsjs'
        })
        .end((error, res) => {
          expect(res).to.have.status(422);
          expect(res.body).to.have.keys('status', 'error');
          expect(res.body.status).to.deep.equal('error');
          expect(res.body.error).deep.to.be.an('array');
          expect(res.body.error[0]).to.have.keys('field', 'message');
          expect(res.body.error[0].field).to.deep.equal('location');
          expect(res.body.error[0].message).to.deep.equal('Invalid location. Special characters other than ".", "-" and "," are not allowed.');
          done();
        });
    });
  });
  // validation tests end here

  it('Should update the user\'s profile', (done) => {
    chai.request(app)
      .patch('/api/v1/profile')
      .set('Authorization', myToken)
      .send({ location: 'Nairobi, Kenya.' })
      .end((error, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.keys('status', 'data');
        expect(res.body.status).to.deep.equal('success');
        expect(res.body.data).to.be.an('object');
        expect(res.body.data.location).to.deep.equal('Nairobi, Kenya.');
        done();
      });
  });
  it('Should update the user\'s profile if bearer is attached if token', (done) => {
    chai.request(app)
      .patch('/api/v1/profile')
      .set('Authorization', `Bearer ${myToken}`)
      .send({ location: 'Nairobi, Kenya.' })
      .end((error, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.keys('status', 'data');
        expect(res.body.status).to.deep.equal('success');
        expect(res.body.data).to.be.an('object');
        expect(res.body.data.location).to.deep.equal('Nairobi, Kenya.');
        done();
      });
  });
  it('Should update the user\'s profile if token is attached to req.body', (done) => {
    chai.request(app)
      .patch('/api/v1/profile')
      .send({ location: 'Nairobi, Kenya.', token: myToken })
      .end((error, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.keys('status', 'data');
        expect(res.body.status).to.deep.equal('success');
        expect(res.body.data).to.be.an('object');
        expect(res.body.data.location).to.deep.equal('Nairobi, Kenya.');
        done();
      });
  });
});
