import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../index';
import models from '../../db/models/index';

const { Request } = models;

const { expect } = chai;
chai.use(chaiHttp);


let myToken;
let userWithoutHistory;

before((done) => {
  chai.request(app)
    .post('/api/v1/auth/signin')
    .send({
      email: 'h.milan@email.com',
      password: 'milanogelato'
    })
    .end((err, res) => {
      myToken = res.body.data.token;
    });
  chai.request(app)
    .post('/api/v1/auth/signin')
    .send({
      email: 'manager@email.com',
      password: 'password77'
    })
    .end((err, res) => {
      userWithoutHistory = res.body.data.token;
    });
    done();
});




describe('Request History', () => { 
    it('Should return a 404 error if user has no history', (done) => {
        chai.request(app)
        .get('/api/v1/requests/history')
        .set('Authorization', userWithoutHistory)
        .end((error, res) => {
            expect(res).to.have.status(404);
            expect(res.body.status).to.deep.equal('error');
            expect(res.body.error).to.deep.equal('No travel or booking history found');
            done();
        });
    });

    it('Should return user\'s trips and booking history', (done) => {
        chai.request(app)
        .get('/api/v1/requests/history')
        .set('Authorization', myToken)
        .end((error, res) => {
            expect(res).to.have.status(200);
            expect(res.body.status).to.deep.equal('success');
            expect(res.body.data).to.be.an('array');
            expect(res.body.data).to.not.be.empty;
            done();
        });
    });

    it('Should fake a server error', (done) => {
        const stub = sinon.stub(Request, 'findAll').throws(new Error());
        chai.request(app)
        .get('/api/v1/requests/history')
        .set('Authorization', myToken)
        .end((error, res) => {
            stub.restore();
            expect(res).to.have.status(500);
            done();
        });
    });
});