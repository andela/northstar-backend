import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);
const baseUrl = 'api/v1/request';
chai.should();

const multyCityRequest = {
    category: 'multy city trip',
    from: 'Lagos',
    destination: ['New York', 'Naorobi', 'Uganda'],
    depature_date: '08-09-2019', 
    return_date: '08-09-2020',
    reason: 'Work',
    rooms: [2, 3, 4]
};

describe('Resquests', () => {
      // Test for creating multy City Request
      describe('Post multy City Request', () => {
          it('it should successfully create a multy city request trip', (done) => {
              chai.request(app)
                .post(`${baseUrl}/multiCityRequests`)
                .send(multyCityRequest) 
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an('object'); 
                    res.body.should.have.property('status').eql('success');
                    done();
                });
          });
      } );
});
