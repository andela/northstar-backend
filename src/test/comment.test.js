import chai from 'chai';
import app from '../index';
import JWTService from '../services/jwt.service';
import sinon from 'sinon';
import Sinonchai from 'sinon-chai';

import CommentController from '../controllers/comment.controller';


chai.should();
chai.use(Sinonchai);

describe('Comments', () => {
  // Test for deleting comment
  describe('/delete comment', () => {
    it('A logged in user should be able to delete his/her own comment', (done) => {
      chai.request(app)
        .delete('/api/v1/comment/1')
        .set('token', JWTService.generateToken({ id: 1, role: 'requester' }))
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('data');
          res.body.data.should.have.property('message');
          done();
        });
    });
  });
  // More test for comments
  describe('/delete comment', () => {
    it('A User that is not logged in should not be able to delete a comment', (done) => {
      chai.request(app)
        .delete('/api/v1/comment/1')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          done();
        });
    });
  });
  describe('/delete comment', () => {
    it('A User with an invalid token should not be allowed to delete comment', (done) => {
      chai.request(app)
        .delete('/api/v1/comment/1')
        .set('token', '24jh3bchjbeureu3f33')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          done();
        });
    });
  });
  describe('/delete comment', () => {
    it('A logged in user should not be able to delete another persons comment', (done) => {
      chai.request(app)
        .delete('/api/v1/comment/1')
        .set('token', JWTService.generateToken({ id: 2, role: 'requester' }))
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          done();
        });
    });
  });
  describe('/delete comment', () => {
    it('A  user should not be able to delete comment with invalid comment_id', (done) => {
      chai.request(app)
        .delete('/api/v1/comment/a')
        .set('token', JWTService.generateToken({ id: 1, role: 'requester' }))
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          done();
        });
    });
  });

  describe('/populate comment for a request', () => {
    it('fakes server error', (done) => {
      const req = { body: {} };
      const res = {
          status() {},
          send() {}
      };
  
      sinon.stub(res, 'status').returnsThis();
  
      CommentController.deleteComment(req, res);
      (res.status).should.have.callCount(1);
      done();
    });
  });

  // Test for populating comments for a request
  describe('/populate comment for a request', () => {
    it('should be able to retrieve comment for a request when an authorize user makes a request', (done) => {
      chai.request(app)
        .get('/api/v1/comment/1')
        .set('token', JWTService.generateToken({ id: 1, role: 'requester' }))
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('data');          
          done();
        });
    });
  });
  
  describe('/populate comment for a request', () => {
    it('Should not be able to populate comment for a request if the user is not logged in', (done) => {
      chai.request(app)
        .get('/api/v1/comment/1')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          done();
        });
    });
  });
  describe('/populate comment for a request', () => {
    it('Should not be able to populate comment for a request if the user supplies invalid token', (done) => {
      chai.request(app)
        .get('/api/v1/comment/1')
        .set('token', '24jh3bchjbeureu3f33')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          done();
        });
    });
  });
  describe('/populate comment for a request', () => {
    it('should not allow an unauthorized user to populate comments for a request', (done) => {
      chai.request(app)
        .get('/api/v1/comment/1')
        .set('token', JWTService.generateToken({ id: 2, role: 'requester' }))
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          done();
        });
    });
  });
  describe('/populate comment for a request', () => {
    it('Should not be able to populate comment for a request if the user supplies invalid request_id', (done) => {
      chai.request(app)
        .get('/api/v1/comment/a')
        .set('token', JWTService.generateToken({ id: 1, role: 'requester' }))
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('error');
          done();
        });
    });
  });

  describe('/populate comment for a request', () => {
    it('fakes server error', (done) => {
      const req = { body: {} };
      const res = {
          status() {},
          send() {}
      };
  
      sinon.stub(res, 'status').returnsThis();
  
      CommentController.getComments(req, res);
      (res.status).should.have.callCount(1);
      done();
    });
  });
  
});
