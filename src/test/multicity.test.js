import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);
chai.should();
const { expect } = chai;

describe('Resquests', () => {
  let token;
  before('signup to get access userToken', async () => {
    const user = {
      email: 'chiwe@gmail.com',
      first_name: 'Chinwe',
      last_name: 'Okonkwo',
      password: 'secret123',
      role: 'requester',
      gender: 'female',
      birth_date: '02-02-2019',
      preferred_language: 'english',
      preferred_currency: 'USD',
      location: 'lagos',
    };
    const userRes = await chai.request(app)
    .post('/api/v1/auth/signup')
    .send(user);
    token = userRes.body.data.token;
  });
  describe('/POST multi city request', () => {
    const requestData = {
      "category": "multi-city",
      "origin": "Lagos Nigeria",
      "destination": "Kigali, Rwanda, london",
      "departure_date": "12-20-2019",
      "return_date": "12-20-2019",
      "reason": "Duty calls",
      "room_id": 2 
     }
    it('it should successfully create a multy city request trip', (done) => {
      chai.request(app)
        .post('/api/v1/request/multiCity')
        .send(requestData)
        .set('authorization', token)
        .end((err, res) => {
          expect(res).to.be.an('object');
          expect(res.status).to.equal(201);
          expect(res.body).to.have.keys('status', 'data');
          expect(res.body.status).to.deep.equals('success');
          expect(res.body.data).to.be.an('object');
          done();
        });
    });
  });
});
