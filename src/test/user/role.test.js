import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';

const { expect } = chai;
chai.use(chaiHttp);


let adminToken;
let userToken;

before((done) => {
  chai.request(app)
    .post('/api/v1/auth/signin')
    .send({
      email: 'superadmin@barefootnomad.com',
      password: 'superadmin'
    })
    .end((err, res) => {
      adminToken = res.body.data.token;
    });

  chai.request(app)
    .post('/api/v1/auth/signin')
    .send({
      email: 'jane_doe@email.com',
      password: 'asdfghjkl'
    })
    .end((err, res) => {
      userToken = res.body.data.token;
      done();
    });
});


describe('User Role', () => {
  describe('Update Role', () => {
    it('Should send a 401 error if Authorization token was not provided', (done) => {
      chai.request(app)
        .patch('/api/v1/role')
        .send({
          email: 'john_doe@email.com',
          role: 'manager'
        })
        .end((error, res) => {
          expect(res).to.have.status(401);
          expect(res.body.status).to.deep.equal('error');
          expect(res.body.error).to.deep.equal('No token provided!');
          done();
        });
    });

    it('Should send a 401 error if Authorization token is invalid', (done) => {
      chai.request(app)
        .patch('/api/v1/role')
        .set('Authorization', 'vjvnls;vlsf')
        .send({
          email: 'john_doe@email.com',
          role: 'manager'
        })
        .end((error, res) => {
          expect(res).to.have.status(401);
          expect(res.body.status).to.deep.equal('error');
          expect(res.body.error).to.deep.equal('Invalid authentication token.');
          done();
        });
    });

    it('Should send a 422 error if email is not provided', (done) => {
      chai.request(app)
        .patch('/api/v1/role')
        .set('Authorization', adminToken)
        .send({
          role: 'manager'
        })
        .end((error, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.deep.equal('error');
          expect(res.body.error[0].field).to.deep.equal('email');
          expect(res.body.error[0].message).to.deep.equal('Invalid email.');
          done();
        });
    });

    it('Should send a 422 error if email is invalid', (done) => {
      chai.request(app)
        .patch('/api/v1/role')
        .set('Authorization', adminToken)
        .send({
          email: 'email',
          role: 'manager'
        })
        .end((error, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.deep.equal('error');
          expect(res.body.error[0].field).to.deep.equal('email');
          expect(res.body.error[0].message).to.deep.equal('Invalid email.');
          done();
        });
    });

    it('Should send a 422 error if the role was not provided', (done) => {
      chai.request(app)
        .patch('/api/v1/role')
        .set('Authorization', adminToken)
        .send({
          email: 'john_doe@demo.com'
        })
        .end((error, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.deep.equal('error');
          expect(res.body.error[0].field).to.deep.equal('role');
          expect(res.body.error[0].message).to.deep
            .equal('Invalid role: choose either "super_admin", "travel_admin", "manager", or "requester"');
          done();
        });
    });

    it('Should send a 422 error if the role is invalid', (done) => {
      chai.request(app)
        .patch('/api/v1/role')
        .set('Authorization', adminToken)
        .send({
          email: 'johndoe@demo.com',
          role: 'some_role'
        })
        .end((error, res) => {
          expect(res).to.have.status(422);
          expect(res.body.status).to.deep.equal('error');
          expect(res.body.error[0].field).to.deep.equal('role');
          expect(res.body.error[0].message).to.deep
            .equal('Invalid role: choose either "super_admin", "travel_admin", "manager", or "requester"');
          done();
        });
    });


    it('Should send a 404 error if user does not exist', (done) => {
      chai.request(app)
        .patch('/api/v1/role')
        .set('Authorization', adminToken)
        .send({
          id: 2,
          email: 'notjohndoe@demo.com',
          role: 'manager'
        })
        .end((error, res) => {
          expect(res).to.have.status(404);
          expect(res.body.status).to.deep.equal('error');
          expect(res.body.error).to.deep.equal('User not found.');
          done();
        });
    });


    it('Should send a 403 status if user is not a super admin', (done) => {
      chai.request(app)
        .patch('/api/v1/role')
        .set('Authorization', userToken)
        .send({
          email: 'john_doe@email.com',
          role: 'manager'
        })
        .end((error, res) => {
          expect(res).to.have.status(403);
          expect(res.body.status).to.deep.equal('error');
          expect(res.body.error).to.deep.equal('You do not have permission for this action.');
          done();
        });
    });


    it('Should send a 200 status if the role was successfully updated', (done) => {
      chai.request(app)
        .patch('/api/v1/role')
        .set('Authorization', adminToken)
        .send({
          email: 'john_doe@email.com',
          role: 'travel_admin'
        })
        .end((error, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.deep.equal('success');
          expect(res.body.data.role).to.deep.equal('travel_admin');
          done();
        });
    });

    it('Should send a 200 status if token has bearer in front', (done) => {
      chai.request(app)
        .patch('/api/v1/role')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          email: 'john_doe@email.com',
          role: 'travel_admin'
        })
        .end((error, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.deep.equal('success');
          expect(res.body.data.role).to.deep.equal('travel_admin');
          done();
        });
    });

    it('Should send a 200 status if token was sent via req.headers.token', (done) => {
      chai.request(app)
        .patch('/api/v1/role')
        .set('token', adminToken)
        .send({
          email: 'john_doe@email.com',
          role: 'travel_admin'
        })
        .end((error, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.deep.equal('success');
          expect(res.body.data.role).to.deep.equal('travel_admin');
          done();
        });
    });

    it('Should send a 200 status if token was sent via req.body.authorization', (done) => {
      chai.request(app)
        .patch('/api/v1/role')
        .send({
          email: 'john_doe@email.com',
          role: 'travel_admin',
          authorization: adminToken
        })
        .end((error, res) => {
          expect(res).to.have.status(200);
          expect(res.body.status).to.deep.equal('success');
          expect(res.body.data.role).to.deep.equal('travel_admin');
          done();
        });
    });
  });
});
