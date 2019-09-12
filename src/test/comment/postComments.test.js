import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../../index';
import models from '../../db/models/index';
const { Request, Comment, Notification } = models;

const { expect } = chai;

chai.use(chaiHttp);

let myToken;
let managerToken;
let userWithoutManagerToken;

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

  chai.request(app)
    .post('/api/v1/auth/signin')
    .send({
      email: 'bola.akin@email.com',
      password: 'bolaji99'
    })
    .end((err, res) => {
      managerToken = res.body.data.token;
    });  

  chai.request(app)
    .post('/api/v1/auth/signin')
    .send({
      email: 'peter_koke@email.com',
      password: 'asdfghjkl'
    })
    .end((err, res) => {
      userWithoutManagerToken = res.body.data.token;
    });  
    done();
});

describe('Post Comments /comments', () => {
    it('Should send a 401 error if authorization token was not provided', (done) => {
        chai.request(app)
        .post('/api/v1/comments')
        .send({
            request_id: 3,
            comment: 'What is the update concerning this?'
        })
        .end((error, res) => {
            expect(res).to.have.status(401);
            expect(res.body.status).to.deep.equal('error');
            expect(res.body.error).to.deep.equal('No token provided!')
            done();
        });
    });

    it('Should send a 401 error if a bad token was sent', (done) => {
        chai.request(app)
        .post('/api/v1/comments')
        .set('Authorization', 'badtoken')
        .send({
            request_id: 3,
            comment: 'What is the update concerning this?'
        })
        .end((error, res) => {
            expect(res).to.have.status(401);
            expect(res.body.status).to.deep.equal('error');
            expect(res.body.error).to.deep.equal('Invalid authentication token.')
            done();
        });    
    });
    
    it('Should send a 422 error if request_id is not an integer', (done) => {
        chai.request(app)
        .post('/api/v1/comments')
        .set('Authorization', myToken)
        .send({
            request_id: 'string',
            comment: 'What is the update concerning this?'
        })
        .end((error, res) => {
            expect(res).to.have.status(422);
            expect(res.body.status).to.deep.equal('error');
            expect(res.body.error[0].field).to.deep.equal('request_id');
            expect(res.body.error[0].message).to.deep.equal('Invalid request id.');
            done();
        });    
    });

    it('Should send a 422 error if comment is was not provided', (done) => {
        chai.request(app)
        .post('/api/v1/comments')
        .set('Authorization', myToken)
        .send({
            request_id: 3,
        })
        .end((error, res) => {
            expect(res).to.have.status(422);
            expect(res.body.status).to.deep.equal('error');
            expect(res.body.error[0].field).to.deep.equal('comment');
            expect(res.body.error[0].message).to.deep.equal('Please enter comment.');
            done();
        });    
    });

    it('Should send a 422 error if comment is more than 350 characters', (done) => {
        let text = 'ndwndndvhjjgefjgnefknbfekbnfhjfnflk;ldfnndfbndfbflbknldbnkbnld ndvmnbfbldldfnblnbjbldfbnlb';
        // creates a long string
        const longText = text+=text+=text+=text+=text+=text;
        chai.request(app)
        .post('/api/v1/comments')
        .set('Authorization', myToken)
        .send({
            request_id: 3,
            comment: longText
        })
        .end((error, res) => {
            expect(res).to.have.status(422);
            expect(res.body.status).to.deep.equal('error');
            expect(res.body.error[0].field).to.deep.equal('comment');
            expect(res.body.error[0].message).to.deep.equal('Too long. Enter a maximum of 350 characters');
            done();
        });    
    });

    it('Should send a 404 error if request does not exist', (done) => {
        chai.request(app)
        .post('/api/v1/comments')
        .set('Authorization', myToken)
        .send({
            request_id: 10,
            comment: 'Is there a way forward?'
        })
        .end((error, res) => {
            expect(res).to.have.status(404);
            expect(res.body.status).to.deep.equal('error');
            expect(res.body.error).to.deep.equal('Request not found.');
            done();
        });
    });

    it('Should send a 403 error if request does not belong to user', (done) => {
        chai.request(app)
        .post('/api/v1/comments')
        .set('Authorization', userWithoutManagerToken)
        .send({
            request_id: 2,
            comment: 'Is there a way forward?'
        })
        .end((error, res) => {
            expect(res).to.have.status(403);
            expect(res.body.status).to.deep.equal('error');
            expect(res.body.error).to.deep.equal('You cannot add a comment to this request.');
            done();
        });
    });

    it('Should send a 403 error is user is neither the manager or owner of the request', (done) => {
        chai.request(app)
        .post('/api/v1/comments')
        .set('Authorization', userWithoutManagerToken)
        .send({
            request_id: 2,
            comment: 'Is there a way forward?'
        })
        .end((error, res) => {
            expect(res).to.have.status(403);
            expect(res.body.status).to.deep.equal('error');
            expect(res.body.error).to.deep.equal('You cannot add a comment to this request.');
            done();
        });
    });

    it('Should post comment if everything checks out', (done) => {
        chai.request(app)
        .post('/api/v1/comments')
        .set('Authorization', myToken)
        .send({
            request_id: 2,
            comment: 'Is there a way forward?'
        })
        .end((error, res) => {
            expect(res).to.have.status(201);
            expect(res.body.status).to.deep.equal('success');
            expect(res.body.data).to.be.an('object');
            expect(res.body.data).to.have
                .keys('comment', 'createdAt', 'delete_status', 'id', 'request_id', 'updatedAt', 'user_id');
            expect(res.body.message).to.deep.equal('A notification was sent to your manager.');
            done();
        });    
    });

    it('Should post comment if token was sent from the req.body', (done) => {
        chai.request(app)
        .post('/api/v1/comments')
        .send({
            request_id: 2,
            comment: 'Please what is the status?',
            token: myToken
        })
        .end((error, res) => {
            expect(res).to.have.status(201);
            expect(res.body.status).to.deep.equal('success');
            expect(res.body.data).to.be.an('object');
            expect(res.body.data).to.have
                .keys('comment', 'createdAt', 'delete_status', 'id', 'request_id', 'updatedAt', 'user_id');
            expect(res.body.message).to.deep.equal('A notification was sent to your manager.');
            done();
        });    
    });

    it('Should post comment if token was sent from the req.headers.token', (done) => {
        chai.request(app)
        .post('/api/v1/comments')
        .set('token', myToken)
        .send({
            request_id: 2,
            comment: 'Please what is the status?',
        })
        .end((error, res) => {
            expect(res).to.have.status(201);
            expect(res.body.status).to.deep.equal('success');
            expect(res.body.data).to.be.an('object');
            expect(res.body.data).to.have
                .keys('comment', 'createdAt', 'delete_status', 'id', 'request_id', 'updatedAt', 'user_id');
            expect(res.body.message).to.deep.equal('A notification was sent to your manager.');
            done();
        });    
    });

    it('Should post comment if token was sent from the req.body.authorization', (done) => {
        chai.request(app)
        .post('/api/v1/comments')
        .send({
            request_id: 2,
            comment: 'Please what is the status?',
            authorization: myToken
        })
        .end((error, res) => {
            expect(res).to.have.status(201);
            expect(res.body.status).to.deep.equal('success');
            expect(res.body.data).to.be.an('object');
            expect(res.body.data).to.have
                .keys('comment', 'createdAt', 'delete_status', 'id', 'request_id', 'updatedAt', 'user_id');
            expect(res.body.message).to.deep.equal('A notification was sent to your manager.');
            done();
        });    
    });

    it('Should post comment if user is the manager of the request\s owner', (done) => {
        chai.request(app)
        .post('/api/v1/comments')
        .send({
            request_id: 2,
            comment: 'Please what is the status?',
            authorization: managerToken
        })
        .end((error, res) => {
            expect(res).to.have.status(201);
            expect(res.body.status).to.deep.equal('success');
            expect(res.body.data).to.be.an('object');
            expect(res.body.data).to.have
                .keys('comment', 'createdAt', 'delete_status', 'id', 'request_id', 'updatedAt', 'user_id');
            expect(res.body.message).to.deep.equal('A notification was sent to the request\'s owner.');
            done();
        });    
    });

    it('Should fake request server error', (done) => {
        const stub = sinon.stub(Request, 'findByPk').throws(new Error());
        chai.request(app)
        .post('/api/v1/comments')
        .send({
            request_id: 2,
            comment: 'Can a notification be sent?',
            authorization: myToken
        })
        .end((error, res) => {
            stub.restore();
            expect(res).to.have.status(500);
            done();
        });    
    });

    it('Should fake comments error', (done) => {
        const stub = sinon.stub(Comment, 'create').throws(new Error());
        chai.request(app)
        .post('/api/v1/comments')
        .send({
            request_id: 2,
            comment: 'Can a notification be sent?',
            authorization: myToken
        })
        .end((error, res) => {
            stub.restore();
            expect(res).to.have.status(500);
            done();
        });    
    });

    it('Should fake notification error', (done) => {
        const stub = sinon.stub(Notification, 'create').throws(new Error());
        chai.request(app)
        .post('/api/v1/comments')
        .send({
            request_id: 2,
            comment: 'Can a notification be sent?',
            authorization: myToken
        })
        .end((error, res) => {
            stub.restore();
            expect(res).to.have.status(201);
            expect(res.body.status).to.deep.equal('success');
            expect(res.body.data).to.be.an('object');
            expect(res.body.data).to.have
                .keys('comment', 'createdAt', 'delete_status', 'id', 'request_id', 'updatedAt', 'user_id');
            expect(res.body.message).to.deep.equal('Could not send notification.');
            done();
        });    
    });
});
