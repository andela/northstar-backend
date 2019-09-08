import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

const { expect } = chai;

chai.use(chaiHttp);

describe('App.js', () => {
  describe('/', () => {
    it('Should send a welcome message', (done) => {
      chai.request(app)
        .get('/')
        .end((error, res) => {
          expect(res).to.have.status(200);
          expect(res.body.Message).to.deep.equal('Welcome! This is the NorthStar Barefoot Nomad homepage');
          done();
        });
    });
  
    it('Should return a 404 error if page is not found', (done) => {
      chai.request(app)
        .get('/not/an/endpoint')
        .end((error, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });
  });
});
