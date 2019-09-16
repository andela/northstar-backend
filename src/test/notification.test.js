import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../index';
import models from '../db/models'


const {Notification} = models;
let userToken = '';
chai.use(chaiHttp);
chai.should();
const { expect } = chai;

before(() => {
    it('it should login user', (done) => {
        chai
        .request(app)
        .post('/api/v1/auth/signin')
        .send({
            email: 'jane_doe@email.com',
            password: 'asdfghjkl',
        })
        .end((err, res) => {
            userToken = res.body.data.token;
            res.body.should.have.property('status').to.equals('success');
            res.body.should.have.property('data').to.be.an('object');
            done();
        });
    });
});

    describe('UNIT TESTS FOR NOTIFICATION', () => {
        describe('/POST REQUEST', () => {
          it('it should mark all notification as read ', (done) => {
            chai
              .request(app)
              .get('/api/v1/mark-read')
              .set('authorization', `Bearer ${userToken}`)
              .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.an('object');
                res.body.should.have.property('status').to.equals('success');
                res.body.should.have
                  .property('message')
                  .to.equals('All Notification marked as read');
                  
                done();
            });
        });
        it('it should not mark all notification as read ', (done) => {
            const stub = sinon.stub(Notification, 'update').returns(new Promise((resolve,reject) => {
                resolve(null);
              }))
            chai
              .request(app)
              .get('/api/v1/mark-read')
              .set('authorization', `Bearer ${userToken}`)
              .end((err, res) => {
                stub.restore();
                res.should.have.status(404);
                res.body.should.be.an('object');
                res.body.should.have.property('status').to.equals('error');
                res.body.should.have
                  .property('error')
                  .to.equals('No notification found');
                 
                done();
            });
        });
    });
    it('it should not mark all notification for internal server error 500', (done) => {
        const stub = sinon.stub(Notification, 'update').throws(new Error())
        chai.request(app)
          .get('/api/v1/mark-read')
          .set('authorization', `Bearer ${userToken}`)
          .end((err, res) => {
            stub.restore();
            expect(res).to.have.status(500);
            expect(res.body).to.have.keys('status','error');
            expect(res.body.status).to.deep.equal('error');
           
            done();
          });
      });
});

        

    