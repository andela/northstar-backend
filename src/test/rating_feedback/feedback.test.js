import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import Sinonchai from 'sinon-chai';
import app from '../../index';
import JWTService from '../../services/jwt.service';
import FeedbackController from '../../controllers/feedback.controller';
import RatingAndFeedBackController from "../../controllers/rating_feedback.controller";

chai.use(Sinonchai);
chai.use(chaiHttp);
chai.should();

const feedbackEndpoint = '/api/v1/feedback/facility';
const superAdminToken = `Bearer ${JWTService.generateToken({ id: 3, role: 'super_admin'})}`;
const travelAdminToken = `Bearer ${JWTService.generateToken({ id: 9, role: 'travel_admin'})}`;
const userToken = `Bearer ${JWTService.generateToken({ id: 1, role: 'requester'})}`;

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

const ratingFeedbackEndpoint = '/api/v1//rating-feedback/facility';
const feedbackGiverToken = `Bearer ${JWTService.generateToken({ id: 7, role: 'super_admin'})}`;

describe('/POST FEEDBACK (RATING)', () => {

    it('should return 403 when user isn\'t logged in', (done) => {
        let newRatingFeedback = {
            facility_id: 3,
            feedback: 'This is the worst facility ever',
            rating: 2,
        };
        chai.request(app)
            .post(`${ratingFeedbackEndpoint}`)
            .set('Authorization', '')
            .send(newRatingFeedback)
            .end((err, res) => {
                res.should.have.status(403);
                res.body.should.have.property('status').eql('error');
                done();
            })
    });

    it('should return 400 on failed authentication', (done) => {
        let newRatingFeedback = {
            facility_id: 3,
            feedback: 'This is the worst facility ever',
            rating: 2,
        };
        chai.request(app)
            .post(ratingFeedbackEndpoint)
            .set('Authorization', 'Bearer xx00x00x0x0x0x0x')
            .send(newRatingFeedback)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('status').eql('error');
                done();
            })
    });

    it('should ensure request body is not malformed', (done) => {
        const newRatingFeedback = {
            facility_id: '',
            feedback: 'This is the worst facility ever',
            rating: 2,
        };
        chai.request(app)
            .post(ratingFeedbackEndpoint)
            .set('Authorization', feedbackGiverToken)
            .send(newRatingFeedback)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('status').eql('error');
                done();
            })
    });

    it('should ensure rating is between 1 and 5', (done) => {
        let newRatingFeedback = {
            facility_id: 2,
            feedback: 'This is the worst facility ever',
            rating: 22,
        };
        chai.request(app)
            .post(ratingFeedbackEndpoint)
            .set('Authorization', feedbackGiverToken)
            .send(newRatingFeedback)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('status').eql('error');
                done();
            })
    });

    it('should ensure facility ID is valid', (done) => {
        const newRatingFeedback = {
            facility_id: 'a',
            feedback: 'This is the worst facility ever',
            rating: 2,
        };
        chai.request(app)
            .post(ratingFeedbackEndpoint)
            .set('Authorization', feedbackGiverToken)
            .send(newRatingFeedback)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('status').eql('error');
                done();
            })
    });

    it('should return 404 if facility does not exist', (done) => {
        const newRatingFeedback = {
            facility_id: 220,
            feedback: 'This is the worst facility ever',
            rating: 2,
        };
        chai.request(app)
            .post(ratingFeedbackEndpoint)
            .set('Authorization', feedbackGiverToken)
            .send(newRatingFeedback)
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.have.property('status').eql('error');
                done();
            })
    });

    it('should ensure user has checked into that facility before', (done) => {
        const newRatingFeedback = {
            facility_id: 3,
            feedback: 'This is the worst facility ever',
            rating: 2,
        };
        chai.request(app)
            .post(ratingFeedbackEndpoint)
            .set('Authorization', feedbackGiverToken)
            .send(newRatingFeedback)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.have.property('status').eql('error');
                done();
            })
    });

    it('should ensure rating is compulsory, feedback is optional', (done) => {
        const newRatingFeedback = {
            facility_id: 1,
            rating: 2,
        };
        chai.request(app)
            .post(ratingFeedbackEndpoint)
            .set('Authorization', feedbackGiverToken)
            .send(newRatingFeedback)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.have.property('status').eql('success');
                done();
            })
    });

    it('should return 201 if all goes well', (done) => {
        const newRatingFeedback = {
            facility_id: 2,
            feedback: 'This is the best facility ever',
            rating: 5,
        };
        chai.request(app)
            .post(ratingFeedbackEndpoint)
            .set('Authorization', feedbackGiverToken)
            .send(newRatingFeedback)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.have.property('status').eql('success');
                done();
            })
    });

    it('should prevent double-feedback', (done) => {
        const newRatingFeedback = {
            facility_id: 2,
            feedback: 'This is the best facility ever',
            rating: 5,
        };
        chai.request(app)
            .post(ratingFeedbackEndpoint)
            .set('Authorization', feedbackGiverToken)
            .send(newRatingFeedback)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.have.property('status').eql('error');
                done();
            })
    });

    it('should return 500 in internal server error', (done) => {
        const req = { body: {} };
        const res = {
            status() {},
            send() {}
        };

        sinon.stub(res, 'status').returnsThis();
        RatingAndFeedBackController.postRatingAndFeedback(req, res);
        (res.status).should.have.callCount(0);
        done();
    });
});
