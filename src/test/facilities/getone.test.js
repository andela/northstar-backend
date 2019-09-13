import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../index';
import models from '../../db/models/index';
const { Facility } = models;

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
      }); 
      done();
});


describe('GET one Facility /api/v1/facilities/:facility_id', () => {
    it('Should send a 404 error if facility is not found', (done) => {
        chai.request(app)
        .get('/api/v1/facilities/300')
        .set('Authorization', myToken)
        .end((error, res) => {
            expect(res).to.have.status(404);
            expect(res.body.error).to.deep.equal('Facility not found.');
            done();
        });
    });

    it('Should send a 422 error if facility id is not an integer', (done) => {
        chai.request(app)
        .get('/api/v1/facilities/string')
        .set('Authorization', myToken)
        .end((error, res) => {
            expect(res).to.have.status(422);
            expect(res.body.error[0].field).to.deep.equal('facility_id');
            expect(res.body.error[0].message).to.deep.equal('Invalid facility id.');
            done();
        });
    });

    it('Should get one facility if everything checks out', (done) => {
        chai.request(app)
        .get('/api/v1/facilities/2')
        .set('Authorization', myToken)
        .end((error, res) => {
            expect(res).to.have.status(200);
            expect(res.body.status).to.deep.equal('success');
            expect(res.body.data).to.be.an('object');
            expect(res.body.data.Likes).to.be.an('array');
            done();
        });
    });

    it('Should fake server error', (done) => {
        const stub = sinon.stub(Facility, 'findByPk').throws(new Error());
        chai.request(app)
        .get('/api/v1/facilities/2')
        .set('Authorization', myToken)
        .end((error, res) => {
            sinon.restore();
            expect(res).to.have.status(500);
            done();
        });
    });
});