import chai from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcrypt';
import sinon from 'sinon';
import Sinonchai from 'sinon-chai';
import app from '../../index';
import models from '../../db/models';
import RoomsController from '../../controllers/facilities.controller';

chai.use(chaiHttp);
chai.should();
chai.use(Sinonchai);

const { expect } = chai;
const { User } = models;

const newUser = {
  first_name: 'Chidi',
  last_name: 'Emenike',
  email: 'chinonsokeo@gmail.com',
  password: 'password123'
};

const room = {
  name: '5Room Now',
  type: 'rExecutive',
  price: 8000,
  facility_id: 2,
  images: ['https://cloudinary.com/16x16/1.png', 'https://cloudinary.com/16x16/1.png']
};

let testUser;
let adminToken;
const route = '/api/v1/facilities/rooms';

const travel_admin = {
  email: 'jane_doe@email.com',
  password: 'asdfghjkl'
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
    .send(travel_admin)
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

describe('FACILITIES/ROOMS', () => {
  // Test Travel Admin Listing his accomodation facilities
  describe('/POST Travel Admin/Super_Admin Add Rooms On An Accommodation Facilities', () => {
    it('it should return unauthorized if user is not logged in', (done) => {
      chai.request(app)
        .post(route)
        .end((error, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          res.body.should.have.property('error').eql('No token provided!');
          done();
        });
    });

    it('it should return an error if user is not a super_admin or manager', (done) => {
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
            .post(route)
            .set('x-access-token', token)
            .end((error, data) => {
              data.should.have.status(401);
              data.body.should.be.an('object');
              done();
            });
        });
    });

    it('Should send a 422 error if no room details is entered', (done) => {
      chai.request(app)
        .post(route)
        .send({})
        .set('Authorization', adminToken)
        .end((error, res) => {
          expect(res).to.have.status(422);
          expect(res.body).to.have.keys('status', 'error');
          expect(res.body.status).to.deep.equal('error');
          expect(res.body.error).to.deep.equal('You have not entered any room details');
          done();
        });
    });

    it('Should send a 422 error if room name is not provided', (done) => {
      chai.request(app)
        .post(route)
        .send({
          type: 'Executive',
          price: 8000,
          facility_id: 2,
          images: ['https://cloudinary.com/16x16/1.png', 'https://cloudinary.com/16x16/1.png']
        })
        .set('Authorization', adminToken)
        .end((error, res) => {
          expect(res).to.have.status(422);
          expect(res.body).to.have.keys('status', 'error');
          expect(res.body.status).to.deep.equal('error');
          expect(res.body.error).deep.to.be.an('array');
          expect(res.body.error[0]).to.have.keys('field', 'message');
          expect(res.body.error[0].field).to.deep.equal('name');
          expect(res.body.error[0].message).to.deep.equal('Kindly Provide a name for your room');
          done();
        });
    });

    it('Should send a 422 error if name is not a string', (done) => {
      chai.request(app)
        .post(route)
        .send({
          name: 4,
          type: 'Executive',
          price: 8000,
          facility_id: 2,
          images: ['https://cloudinary.com/16x16/1.png', 'https://cloudinary.com/16x16/1.png']
        })
        .set('Authorization', adminToken)
        .end((error, res) => {
          expect(res).to.have.status(422);
          expect(res.body).to.have.keys('status', 'error');
          expect(res.body.status).to.deep.equal('error');
          expect(res.body.error).deep.to.be.an('array');
          expect(res.body.error[0]).to.have.keys('field', 'message');
          expect(res.body.error[0].field).to.deep.equal('name');
          expect(res.body.error[0].message).to.deep.equal('The name of your facility rooms must be a string');
          done();
        });
    });

    it('Should send a 422 error if name is too short', (done) => {
      chai.request(app)
        .post(route)
        .send({
          name: '4',
          type: 'Executive',
          price: 8000,
          facility_id: 2,
          images: ['https://cloudinary.com/16x16/1.png', 'https://cloudinary.com/16x16/1.png']
        })
        .set('Authorization', adminToken)
        .end((error, res) => {
          expect(res).to.have.status(422);
          expect(res.body).to.have.keys('status', 'error');
          expect(res.body.status).to.deep.equal('error');
          expect(res.body.error).deep.to.be.an('array');
          expect(res.body.error[0]).to.have.keys('field', 'message');
          expect(res.body.error[0].field).to.deep.equal('name');
          expect(res.body.error[0].message).to.deep.equal('Too short: enter a minimum of 2 characters');
          done();
        });
    });

    it('Should send a 422 error if room type is not provided', (done) => {
      chai.request(app)
        .post(route)
        .send({
          name: '5Room Now',
          price: 8000,
          facility_id: 2,
          images: ['https://cloudinary.com/16x16/1.png', 'https://cloudinary.com/16x16/1.png']
        })
        .set('Authorization', adminToken)
        .end((error, res) => {
          expect(res).to.have.status(422);
          expect(res.body).to.have.keys('status', 'error');
          expect(res.body.status).to.deep.equal('error');
          expect(res.body.error).deep.to.be.an('array');
          expect(res.body.error[0]).to.have.keys('field', 'message');
          expect(res.body.error[0].field).to.deep.equal('type');
          expect(res.body.error[0].message).to.deep.equal('Kindly enter the type of room');
          done();
        });
    });

    it('Should send a 422 error if room type is not a string', (done) => {
      chai.request(app)
        .post(route)
        .send({
          name: '5Room Now',
          type: 56,
          price: 8000,
          facility_id: 2,
          images: ['https://cloudinary.com/16x16/1.png', 'https://cloudinary.com/16x16/1.png']
        })
        .set('Authorization', adminToken)
        .end((error, res) => {
          expect(res).to.have.status(422);
          expect(res.body).to.have.keys('status', 'error');
          expect(res.body.status).to.deep.equal('error');
          expect(res.body.error).deep.to.be.an('array');
          expect(res.body.error[0]).to.have.keys('field', 'message');
          expect(res.body.error[0].field).to.deep.equal('type');
          expect(res.body.error[0].message).to.deep.equal('The address of your facility rooms must be a string');
          done();
        });
    });

    it('Should send a 422 error if room type is shorter than 5 letters', (done) => {
      chai.request(app)
        .post(route)
        .send({
          name: '5Room Now',
          type: 'Exe',
          price: 8000,
          facility_id: 2,
          images: ['https://cloudinary.com/16x16/1.png', 'https://cloudinary.com/16x16/1.png']
        })
        .set('Authorization', adminToken)
        .end((error, res) => {
          expect(res).to.have.status(422);
          expect(res.body).to.have.keys('status', 'error');
          expect(res.body.status).to.deep.equal('error');
          expect(res.body.error).deep.to.be.an('array');
          expect(res.body.error[0]).to.have.keys('field', 'message');
          expect(res.body.error[0].field).to.deep.equal('type');
          expect(res.body.error[0].message).to.deep.equal('Too short: enter a minimum of 5 characters');
          done();
        });
    });

    it('Should send a 422 error if room price is not provided', (done) => {
      chai.request(app)
        .post(route)
        .send({
          name: '5Room Now',
          type: 'Executive',
          facility_id: 2,
          images: ['https://cloudinary.com/16x16/1.png', 'https://cloudinary.com/16x16/1.png']
        })
        .set('Authorization', adminToken)
        .end((error, res) => {
          expect(res).to.have.status(422);
          expect(res.body).to.have.keys('status', 'error');
          expect(res.body.status).to.deep.equal('error');
          expect(res.body.error).deep.to.be.an('array');
          expect(res.body.error[0]).to.have.keys('field', 'message');
          expect(res.body.error[0].field).to.deep.equal('price');
          expect(res.body.error[0].message).to.deep.equal('You must attach a price tag to a room');
          done();
        });
    });

    it('Should send a 422 error if room price is shorter than 10 letters', (done) => {
      chai.request(app)
        .post(route)
        .send({
          name: '5Room Now',
          type: 'rExecutive',
          price: 'R8000',
          facility_id: 2,
          images: ['https://cloudinary.com/16x16/1.png', 'https://cloudinary.com/16x16/1.png']
        })
        .set('Authorization', adminToken)
        .end((error, res) => {
          expect(res).to.have.status(422);
          expect(res.body).to.have.keys('status', 'error');
          expect(res.body.status).to.deep.equal('error');
          expect(res.body.error).deep.to.be.an('array');
          expect(res.body.error[0]).to.have.keys('field', 'message');
          expect(res.body.error[0].field).to.deep.equal('price');
          expect(res.body.error[0].message).to.deep.equal('Price of Rooms must be a number');
          done();
        });
    });

    it('Should send a 422 error if room images is not an array', (done) => {
      chai.request(app)
        .post(route)
        .send({
          name: '5Room Now',
          type: 'Executive',
          price: 8000,
          facility_id: 2,
          images: 'https://cloudinary.com/16x16/1.png'
        })
        .set('Authorization', adminToken)
        .end((error, res) => {
          expect(res).to.have.status(422);
          expect(res.body).to.have.keys('status', 'error');
          expect(res.body.status).to.deep.equal('error');
          expect(res.body.error).deep.to.be.an('array');
          expect(res.body.error[0]).to.have.keys('field', 'message');
          expect(res.body.error[0].field).to.deep.equal('images');
          expect(res.body.error[0].message).to.deep.equal('Images must be an array');
          done();
        });
    });

    it('It Should Successfully Create Rooms on an Accomodation Facility with all valid fields', (done) => {
      chai.request(app)
        .post(route)
        .set('token', adminToken)
        .send(room)
        .end((error, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.keys('status', 'data');
          expect(res.body.status).to.deep.equal('success');
          expect(res.body.data).to.be.an('object');
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

      RoomsController.createFacilities(req, res);
      (res.status).should.have.callCount(1);
      done();
    });

    it('fakes server error', (done) => {
      const req = { body: {} };
      const res = {
        status() { },
        send() { }
      };

      sinon.stub(res, 'status').returnsThis();

      RoomsController.createRoom(req, res);
      res.status.should.have.callCount(0);
      done();
    });
  });
});
