import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);
chai.should();

describe('/GET Indexing', () => {
  it('return success on page load', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });

  it('return failure on nonexistent route', (done) => {
    chai.request(app)
      .get('/nonexistent')
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });

  it('return failure on nonexistent route v1', (done) => {
    chai.request(app)
      .get('/api/v1/nonexistent')
      .end((err, res) => {
        res.should.have.status(404);
        done();
      });
  });
});
