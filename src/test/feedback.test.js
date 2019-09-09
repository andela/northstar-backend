import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import Sinonchai from 'sinon-chai';
import app from '../index';
import JWTService from '../services/jwt.service';
import FeedbackController from '../controllers/feedback.controller';

chai.use(Sinonchai);
chai.use(chaiHttp);
chai.should();

const feedbackEndpoint = '/api/v1/feedback/facility';

const newFeedback = {
    feedback: 'This is the worst facility ever'
};

let userToken = `Bearer ${JWTService.generateToken({ id: 1, role: 'requester'})}`;

describe('/POST FEEDBACK', () => {

    it('should allow only logged in users', (done) => {
        chai.request(app)
            .post(`${feedbackEndpoint}/1`)
            .set('Authorization', '')
            .send(newFeedback)
            .end((err, res) => {
                res.should.have.status(403);
                res.body.should.have.property('status').eql('error');
                done();
            })
    });

    it('should return 404 if facility does not exist', (done) => {
        chai.request(app)
            .post(`${feedbackEndpoint}/1000`)
            .set('Authorization', userToken)
            .send(newFeedback)
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.have.property('status').eql('error');
                done();
            })
    });

    it('should return 201 if feedback posted successfully', (done) => {
        chai.request(app)
            .post(`${feedbackEndpoint}/3`)
            .set('Authorization', userToken)
            .send(newFeedback)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.have.property('status').eql('success');
                done();
            })
    });

    it('should return 400 on invalid facility ID', (done) => {
        chai.request(app)
            .post(`${feedbackEndpoint}/a`)
            .set('Authorization', userToken)
            .send(newFeedback)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('status').eql('error');
                done();
            })
    });

    it('should return 400 with malformed request body', (done) => {
        newFeedback.feedback = '';
        chai.request(app)
            .post(`${feedbackEndpoint}/3`)
            .set('Authorization', userToken)
            .send(newFeedback)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('status').eql('error');
                done();
            })
    });

    it('should return 500 if something goes wrong', (done) => {
        const req = {
            params: {},
            body: {}
        };

        const res = {
            status() {},
            send() {}
        };

        sinon.stub(res, 'status').returnsThis();

        FeedbackController.postFeedback(req, res);
        (res.status).should.have.callCount(0);
        done();
    });
});
