import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import Sinonchai from 'sinon-chai';
import app from '../index';
import EmailService from '../services/email.service';

chai.use(Sinonchai);
chai.use(chaiHttp);
chai.should();

const { expect } = chai;

describe('/Email service', () => { 
   
  it('fakes server email service', (done) => {
    const req = { body: {} };
    const res = {
      status() { },
      send() { }
    };

    sinon.stub(res, 'status').returnsThis();

    EmailService.sendEmail(req, res);
    (res.status).should.have.callCount(0);
    done();
  }); 
});
