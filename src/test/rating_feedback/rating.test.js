import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import Sinonchai from 'sinon-chai';
import app from '../../index';
import RatingController from '../../controllers/rating.controller';

chai.use(Sinonchai);
chai.use(chaiHttp);
chai.should();

const ratingEndpoint = '/api/v1/rating/facility';

describe('/GET RATINGS', () => {
  it('should not require user to be logged in', (done) => {
    chai.request(app)
      .get(`${ratingEndpoint}/1`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('status').eql('success');
        done();
      });
  });

  it('should return 404 if facility does not exist', (done) => {
    chai.request(app)
      .get(`${ratingEndpoint}/1000`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('status').eql('error');
        done();
      });
  });

  it('should return 404 if no rating is found for a facility', (done) => {
    chai.request(app)
      .get(`${ratingEndpoint}/3`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('status').eql('error');
        done();
      });
  });

  it('should return 200 if rating is found for a facility', (done) => {
    chai.request(app)
      .get(`${ratingEndpoint}/1`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('status').eql('success');
        done();
      });
  });

  it('should return 400 on invalid facility ID', (done) => {
    chai.request(app)
      .get(`${ratingEndpoint}/a`)
      .end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('status').eql('error');
        done();
      });
  });

  it('should return 500 if something goes wrong', (done) => {
    const req = {
      params: {}
    };

    const res = {
      status() {},
      send() {}
    };

    sinon.stub(res, 'status').returnsThis();

    RatingController.findAll(req, res);
    (res.status).should.have.callCount(0);
    done();
  });
});
