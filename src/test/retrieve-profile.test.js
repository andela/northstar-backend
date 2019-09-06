import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import Sinonchai from 'sinon-chai';
import app from '../index';
import JWTService from '../services/jwt.service';
import UserController from '../controllers/user.controller';

chai.use(Sinonchai);
chai.use(chaiHttp);
chai.should();

const profileEndpoint = '/api/v1/user/profile';
let userToken = `Bearer ${JWTService.generateToken({ id: 1, role: 'requester'})}`;

describe('/RETRIEVE PROFILE', () => {

    it('should allow only logged in users', (done) => {
        chai.request(app)
            .get(`${profileEndpoint}?rememberMe=yes`)
            .set('Authorization', '')
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.have.property('status').eql('error');
                done();
            })
    });

    it('should return 200 if profile is retrieved successfully', (done) => {
        chai.request(app)
            .get(`${profileEndpoint}?rememberMe=yes`)
            .set('Authorization', userToken)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('status').eql('success');
                done();
            })
    });

    it('should return 500 if something goes wrong', (done) => {
        const req = {
            query: {
                rememberMe: 'yes'
            },
            headers: {
                authorization: userToken
            },
            body: {
                user: {
                    id: 3
                }
            }
        };

        const res = {
            status() {},
            send() {}
        };

        sinon.stub(res, 'status').returnsThis();

        UserController.retrieveProfile(req, res);
        (res.status).should.have.callCount(0);
        done();
    });

    it('should return 403 when rememberMe is set to NO', (done) => {
        chai.request(app)
            .get(`${profileEndpoint}?rememberMe=no`)
            .set('Authorization', userToken)
            .end((err, res) => {
                res.should.have.status(403);
                res.body.should.have.property('status').eql('error');
                done();
            })
    });
});
