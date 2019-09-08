import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

const { expect } = chai;

chai.use(chaiHttp);

const badToken = 'hhdnjnsdusdid9';

describe('JWT Authentication Middleware', () => {
  it('Should send a 401 error if no token is provided for a protected route', (done) => {
    chai.request(app)
      .patch('/api/v1/profile')
      .send({ first_name: 'Osahon' })
      .end((error, res) => {
        expect(res).to.have.status(401);
        expect(res.body.status).to.deep.equal('error');
        expect(res.body.error).to.deep.equal('Token was not provided.');
        done();
      });
  });

  it('Should send a 401 error if authentication token is invalid', (done) => {
    chai.request(app)
      .patch('/api/v1/profile')
      .set('Authorization', badToken)
      .send({ first_name: 'Osahon' })
      .end((error, res) => {
        expect(res).to.have.status(401);
        expect(res.body.status).to.deep.equal('error');
        expect(res.body.error).to.deep.equal('Invalid authentication token.');
        done();
      });
  });
});
