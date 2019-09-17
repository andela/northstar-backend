import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import Sinonchai from 'sinon-chai';

import app from '../../index';
import JWTService from '../../services/jwt.service';
import NotificationsController from '../../controllers/notification.controller';


chai.use(chaiHttp);
chai.should();
chai.use(Sinonchai);

const { expect } = chai;



describe('GET /api/v1/notifications', () => {
  const urlBase = '/api/v1/notifications';

  describe('Fetching notifications', () => {
    it('should fetch notifications for a logged in user', async () => {
        const userDetails = { id: 3, role: 'requester' };          
        const userToken = JWTService.generateToken(userDetails);

        const res = await chai.request(app)
            .get(`${urlBase}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send();

        expect(res.status).to.equal(200);
        expect(res.body).to.have.keys('status', 'data');
        expect(res.body.status).to.equal('success');                 
    });      
    it('should not fetch notifications for a user who is not logged in', async () => {
      
        const res = await chai.request(app)
            .get(`${urlBase}`)           
            .send();

        expect(res.status).to.equal(403);
        expect(res.body).to.have.keys('status', 'error');                       
    });         
  });
  
  describe('/notification', () => {
    it('fakes server error for creating notifications', (done) => {
      const req = { body: {} };
      const res = {
        status() { },
        send() { }
      };

      sinon.stub(res, 'status').returnsThis();

      NotificationsController.createNotification();
      done();
    });
    it('fakes server error for checking notifications status', (done) => {
      const req = { body: {} };
      const res = {
        status() { },
        send() { }
      };

      sinon.stub(res, 'status').returnsThis();

      NotificationsController.checkNotificationStatus();      
      done();
    });
    it('fakes server error for getting notifications', (done) => {
      const req = { body: {} };
      const res = {
        status() { },
        send() { }
      };

      sinon.stub(res, 'status').returnsThis();

      NotificationsController.getNotifications();      
      done();
    });
  });
});
