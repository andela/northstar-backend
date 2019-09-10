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

let superAdminToken = `Bearer ${JWTService.generateToken({ id: 3, role: 'super_admin'})}`;
let travelAdminToken = `Bearer ${JWTService.generateToken({ id: 9, role: 'travel_admin'})}`;
let userToken = `Bearer ${JWTService.generateToken({ id: 1, role: 'requester'})}`;

describe('/GET FEEDBACK', () => {

    it('should allow only logged in users', (done) => {
        chai.request(app)
            .get(`${feedbackEndpoint}/1`)
            .set('Authorization', '')
            .end((err, res) => {
                res.should.have.status(403);
                res.body.should.have.property('status').eql('error');
                done();
            })
    });

    it('should allow Super Admins', (done) => {
        chai.request(app)
            .get(`${feedbackEndpoint}/1`)
            .set('Authorization', superAdminToken)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('status').eql('success');
                done();
            })
    });

    it('should allow Travel Admins', (done) => {
        chai.request(app)
            .get(`${feedbackEndpoint}/1`)
            .set('Authorization', travelAdminToken)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('status').eql('success');
                done();
            })
    });

    it('should deny users who are NOT Super Admins', (done) => {
        chai.request(app)
            .get(`${feedbackEndpoint}/1`)
            .set('Authorization', userToken)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.have.property('status').eql('error');
                done();
            })
    });

    it('should return 404 if facility does not exist', (done) => {
        chai.request(app)
            .get(`${feedbackEndpoint}/1000`)
            .set('Authorization', superAdminToken)
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.have.property('status').eql('error');
                done();
            })
    });

    it('should return 404 if no feedback is found for a facility', (done) => {
        chai.request(app)
            .get(`${feedbackEndpoint}/3`)
            .set('Authorization', superAdminToken)
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.have.property('status').eql('error');
                done();
            })
    });

    it('should return 200 if feedback is found for a facility', (done) => {
        chai.request(app)
            .get(`${feedbackEndpoint}/1`)
            .set('Authorization', superAdminToken)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('status').eql('success');
                done();
            })
    });

    it('should return 400 on invalid facility ID', (done) => {
        chai.request(app)
            .get(`${feedbackEndpoint}/a`)
            .set('Authorization', superAdminToken)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('status').eql('error');
                done();
            })
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

        FeedbackController.findAll(req, res);
        (res.status).should.have.callCount(0);
        done();
    });
});
