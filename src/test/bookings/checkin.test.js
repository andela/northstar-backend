import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../index';
import models from '../../db/models/index';

const { Booking } = models;

const { expect } = chai;
chai.use(chaiHttp);

let myToken;

before((done) => {
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send({
        email: 'bola.akin@email.com',
        password: 'bolaji99'
      })
      .end((err, res) => {
        myToken = res.body.data.token;
      }); 
      done();
});


describe('Bookings', () => {
    describe('/api/v1/bookings/:booking_id/checkin', () => {
        it('Should send a 401 error if jwt token was not sent along with request', (done) => {
            chai.request(app)
            .patch('/api/v1/bookings/1/checkin')
            .end((error, res) => {
                expect(res).to.have.status(401);
                expect(res.body.status).to.deep.equal('error');
                expect(res.body.status).to.deep.equal('error');
                expect(res.body.error).to.deep.equal('No token provided!');
                done();
            });
        });

        it('Should send a 401 error if a bad token was sent', (done) => {
            chai.request(app)
            .patch('/api/v1/bookings/1/checkin')
            .set('Authorization', 'vndvjvmnvjmv')
            .end((error, res) => {
                expect(res).to.have.status(401);
                expect(res.body.status).to.deep.equal('error');
                expect(res.body.status).to.deep.equal('error');
                expect(res.body.error).to.deep.equal('Invalid authentication token.');
                done();
            });
        });

        it('Should send a 422 error if booking_id is not an integer', (done) => {
            chai.request(app)
            .patch('/api/v1/bookings/string/checkin')
            .set('Authorization', myToken)
            .end((error, res) => {
                expect(res).to.have.status(422);
                expect(res.body.status).to.deep.equal('error');
                expect(res.body.error[0].field).to.deep.equal('booking_id');
                expect(res.body.error[0].message).to.deep.equal('Invalid booking id.');
                done();
            });
        });

        it('Should send a 404 error if booking is not found', (done) => {
            chai.request(app)
            .patch('/api/v1/bookings/333/checkin')
            .set('Authorization', myToken)
            .end((error, res) => {
                expect(res).to.have.status(404);
                expect(res.body.status).to.deep.equal('error');
                expect(res.body.error).to.deep.equal('Could not find booking.');
                done();
            });
        });

        it('Should send a 200 status if everything checks out', (done) => {
            chai.request(app)
            .patch('/api/v1/bookings/1/checkin')
            .set('Authorization', myToken)
            .end((error, res) => {
                expect(res).to.have.status(200);
                expect(res.body.status).to.deep.equal('success');
                expect(res.body.data).to.have.keys('id', 'user_id', 'room_id', 'departure_date', 'return_date', 'checked_in', 'createdAt', 'updatedAt');
                expect(res.body.data.checked_in).to.be.true;
                done();
            });
        });

        it('Should fake server error', (done) => {
            const stub = sinon.stub(Booking, 'update').throws(new Error());
            chai.request(app)
            .patch('/api/v1/bookings/1/checkin')
            .set('Authorization', myToken)
            .end((error, res) => {
                stub.restore();
                expect(res).to.have.status(500);
                done();
            });
        });
    });
});
  