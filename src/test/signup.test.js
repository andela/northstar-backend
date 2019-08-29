import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);
chai.should();
const { expect } = chai;

const user = {
  email: 'chiomadans@gmail.com',
  first_name: 'Ejike',
  last_name: 'Chiemerie',
  password: 'secret123',
  role: 'requester',
  gender: 'female',
  birth_date: '02-02-2019',
  preferred_language: 'english',
  preferred_currency: 'USD',
  location: 'lagos',
};

describe('Users', () => {
    // Test for creating new user
    describe('/POST register users', () => {
        it('it should Signup a user and generate a token', (done) => {
            chai.request(app)
                .post('/api/v1/auth/signup')
                .send(user)
                .end((err, res) => {
                    user.token = res.body.data.token;
                    res.should.have.status(201);
                    res.body.should.be.an('object');
                    res.body.should.have.property('status').eql('success');
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('first_name');
                    res.body.data.should.have.property('last_name');
                    res.body.data.should.have.property('email');
                    done();
                });
        });
    });

    describe('/GET Requests', () => {
        it('should return 404 on zero requests found', (done) => {
            const validToken = `Bearer ${user.token}`;
            chai.request(app)
                .get('/api/v1/requests')
                .set('Authorization', validToken)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                })
        });
        it('should not register a new user with an already existing email', (done) => {
            chai.request(app)
              .post('/api/v1/auth/signup')
              .send(user)
              .end((err, res) => {
                expect(res).to.have.status(409);
                expect(res.body).to.be.an('object');
                expect(res.body.message).to.equal('user already registered');
                done();
              });
          });
        });
        it('it should not signup invalid lastname', (done) => {
            chai
              .request(app)
              .post('/api/v1/auth/signup')
              .send( {
                email: 'chiomadans@gmail.com',
                first_name: 'Ejike',
                last_name: '',
                password: 'secret123',
                role: 'requester',
                gender: 'female',
                birth_date: '02-02-2019',
                preferred_language: 'english',
                preferred_currency: 'USD',
                location: 'lagos',
              })
              .end((err, res) => {
                res.should.have.status(422);
                res.body.should.have.property('status').to.equals('error');
        
                done();
              });
          });
        
          
        
          it('it should not signup invalid firstname', (done) => {
            chai
              .request(app)
              .post('/api/v1/auth/signup')
              .send( {
                email: 'chiomadans@gmail.com',
                first_name: '',
                last_name: 'Ejike',
                password: 'secret123',
                role: 'requester',
                gender: 'female',
                birth_date: '02-02-2019',
                preferred_language: 'english',
                preferred_currency: 'USD',
                location: 'lagos',
              })
              .end((err, res) => {
                res.should.have.status(422);
                res.body.should.have.property('status').to.equals('error');
                done();
              });
            });

            it('it should not signup invalid password', (done) => {
                chai
                  .request(app)
                  .post('/api/v1/auth/signup')
                  .send( {
                    email: 'chiomadans@gmail.com',
                    first_name: 'Ejike',
                    last_name: 'ddd',
                    password: 'secre t123',
                    role: 'requester',
                    gender: 'female',
                    birth_date: '02-02-2019',
                    preferred_language: 'english',
                    preferred_currency: 'USD',
                    location: 'lagos',
                  })
                  .end((err, res) => {
                    res.should.have.status(422);
                    res.body.should.have.property('status').to.equals('error');
                    done();
                  });
                });
                it('it should not signup invalid email', (done) => {
                    chai
                      .request(app)
                      .post('/api/v1/auth/signup')
                      .send( {
                        email: 'chiomadansgmail.com',
                        first_name: 'Ejike',
                        last_name: 'ddd',
                        password: 'secret123',
                        role: 'requester',
                        gender: 'female',
                        birth_date: '02-02-2019',
                        preferred_language: 'english',
                        preferred_currency: 'USD',
                        location: 'lagos',
                      })
                      .end((err, res) => {
                        res.should.have.status(422);
                        res.body.should.have.property('status').to.equals('error');
                        done();
                      });
                    });
    });
    



