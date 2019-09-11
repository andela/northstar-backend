import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../../index';
import models from '../../db/models';
import JWTService from '../../services/jwt.service';


chai.use(chaiHttp);

const { expect } = chai;
const { Request } = models;
const requestEndpoint = '/api/v1/requests';

describe('/GET /api/v1/requests?query=queryValue', () => {
  describe('SUCCESS', () => {
    // Owner requesting
    it('should search for a requester\'s own requests using origin irrespective of padded space',
        async () => {
            const userDetails = { id: 9, email: 'dan.spielberg@email.com', role: 'requester' };
            const userToken = JWTService.generateToken(userDetails);
            const origin = '   venice  ';
            const res = await chai.request(app)
                .get(`${requestEndpoint}?origin=${origin}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send();
            
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys('status', 'data');
            expect(res.body.status).to.equal('success');
            expect(res.body.data).to.be.an('array');
            expect(res.body.data).to.not.be.empty;
            expect(res.body.data[0]).to.have.property('user_id');
            expect(res.body.data[0]).to.have.property('origin');
            res.body.data.forEach((el) => {
                expect(el.user_id).to.equal(userDetails.id);
                expect(el.origin.toLowerCase()).to.equal(origin.trim().toLowerCase());
            });
    });

    it('should search for a requester\'s own requests using destination irrespective of case and padded space',
        async () => {
            const userDetails = { id: 9, email: 'dan.spielberg@email.com', role: 'requester' };
            const userToken = JWTService.generateToken(userDetails);
            const destination = '  Serbia & Montenegro ';
            const res = await chai.request(app)
                .get(`${requestEndpoint}?destination=${encodeURIComponent(destination)}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send();
            
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys('status', 'data');
            expect(res.body.status).to.equal('success');
            expect(res.body.data).to.be.an('array');
            expect(res.body.data).to.not.be.empty;
            expect(res.body.data[0]).to.have.property('user_id');
            expect(res.body.data[0]).to.have.property('destination');
            res.body.data.forEach((el) => {
                expect(el.user_id).to.equal(userDetails.id);
                expect(el.destination).to.include(destination.trim().toLowerCase());
            });
    });

    it('should search for a requester\'s own requests using the request ID',
        async () => {
            const userDetails = { id: 9, email: 'dan.spielberg@email.com', role: 'requester' };
            const userToken = JWTService.generateToken(userDetails);
            const requestId = 5;
            const res = await chai.request(app)
                .get(`${requestEndpoint}?request_id=${requestId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send();
            
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys('status', 'data');
            expect(res.body.status).to.equal('success');
            expect(res.body.data).to.be.an('array');
            expect(res.body.data).to.be.lengthOf(1);
            expect(res.body.data[0]).to.have.property('user_id');
            expect(res.body.data[0]).to.have.property('id');
            expect(res.body.data[0].user_id).to.equal(userDetails.id);
            expect(res.body.data[0].id).to.equal(requestId);
    });

    it('should search for a requester\'s own requests using duration in days irrespective of padded spaces',
        async () => {
            const userDetails = { id: 9, email: 'dan.spielberg@email.com', role: 'requester' };
            const userToken = JWTService.generateToken(userDetails);
            const duration = '  365  ';
            const res = await chai.request(app)
                .get(`${requestEndpoint}?duration=${encodeURIComponent(duration)}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send();
            
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys('status', 'data');
            expect(res.body.status).to.equal('success');
            expect(res.body.data).to.be.an('array');
            expect(res.body.data).to.not.be.empty;
            expect(res.body.data[0]).to.have.property('user_id');
            expect(res.body.data[0]).to.have.property('departure_date');
            expect(res.body.data[0]).to.have.property('return_date');
            res.body.data.forEach((el) => {
                expect(el.user_id).to.equal(userDetails.id);
                expect((new Date(el.return_date) - new Date(el.departure_date)) / (24 * 3600000))
                    .to.equal(parseInt(duration.trim().match(/\d+/)[0], 10));
            });
    });

    it('should search for a requester\'s own requests using the start date irrespective of padded spaces',
        async () => {
            const userDetails = { id: 9, email: 'dan.spielberg@email.com', role: 'requester' };
            const userToken = JWTService.generateToken(userDetails);
            const startDate = `  ${new Date().toISOString().split('T')[0]}  `;
            const res = await chai.request(app)
                .get(`${requestEndpoint}?start_date=${encodeURIComponent(startDate)}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send();
            
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys('status', 'data');
            expect(res.body.status).to.equal('success');
            expect(res.body.data).to.be.an('array');
            expect(res.body.data).to.not.be.empty;
            expect(res.body.data[0]).to.have.property('user_id');
            expect(res.body.data[0]).to.have.property('departure_date');
            res.body.data.forEach((el) => {
                expect(el.user_id).to.equal(userDetails.id);
                expect(el.departure_date).to.equal(startDate.trim());
            });
    });

    it('should search for a requester\'s own requests using request status irrespective of padded space and case',
        async () => {
            const userDetails = { id: 9, email: 'dan.spielberg@email.com', role: 'requester' };
            const userToken = JWTService.generateToken(userDetails);
            const requestStatus = '  PENDING ';
            const res = await chai.request(app)
                .get(`${requestEndpoint}?status=${encodeURIComponent(requestStatus)}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send();
            
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys('status', 'data');
            expect(res.body.status).to.equal('success');
            expect(res.body.data).to.be.an('array');
            expect(res.body.data).to.not.be.empty;
            expect(res.body.data[0]).to.have.property('user_id');
            expect(res.body.data[0]).to.have.property('status');
            res.body.data.forEach((el) => {
                expect(el.user_id).to.equal(userDetails.id);
                expect(el.status).to.equal(requestStatus.trim().toLowerCase());
            });
    });

    it('should search for a requester\'s own requests category irrespective of padded space and case',
        async () => {
            const userDetails = { id: 9, email: 'dan.spielberg@email.com', role: 'requester' };
            const userToken = JWTService.generateToken(userDetails);
            const category = '  multi-city  ';
            const res = await chai.request(app)
                .get(`${requestEndpoint}?category=${encodeURIComponent(category)}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send();
            
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys('status', 'data');
            expect(res.body.status).to.equal('success');
            expect(res.body.data).to.be.an('array');
            expect(res.body.data).to.not.be.empty;
            expect(res.body.data[0]).to.have.property('user_id');
            expect(res.body.data[0]).to.have.property('category');
            res.body.data.forEach((el) => {
                expect(el.user_id).to.equal(userDetails.id);
                expect(el.category).to.equal(category.trim().toLowerCase());
            });
    });

    // Manager requesting
    it(`should search requesters requests for their manager using origin irrespective of
        case and padded space`,
        async () => {
            const userDetails = { id: 1, email: 'bola.akin@email.com', role: 'manager' };
            const userToken = JWTService.generateToken(userDetails);
            const origin = '   MUNICH  ';
            const res = await chai.request(app)
                .get(`${requestEndpoint}?origin=${origin}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send();
            
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys('status', 'data');
            expect(res.body.status).to.equal('success');
            expect(res.body.data).to.be.an('array');
            expect(res.body.data).to.not.be.empty;
            expect(res.body.data[0]).to.have.property('user_id');
            expect(res.body.data[0]).to.have.property('origin');
            res.body.data.forEach((el) => {
                // User 3, 4, and 9 are managed by user 1
                expect([3, 4, 9]).to.include(el.user_id);
                expect(el.origin.toLowerCase()).to.equal(origin.trim().toLowerCase());
            });
    });

    it('should search requesters requests for their manager using destination irrespective of case',
        async () => {
            const userDetails = { id: 1, email: 'bola.akin@email.com', role: 'manager' };
            const userToken = JWTService.generateToken(userDetails);
            const destination = 'LOME';
            const res = await chai.request(app)
                .get(`${requestEndpoint}?destination=${destination}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send();
            
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys('status', 'data');
            expect(res.body.status).to.equal('success');
            expect(res.body.data).to.be.an('array');
            expect(res.body.data).to.not.be.empty;
            expect(res.body.data[0]).to.have.property('user_id');
            expect(res.body.data[0]).to.have.property('destination');
            res.body.data.forEach((el) => {
                // User 3, 4, and 9 are managed by user 1
                expect([3, 4, 9]).to.include(el.user_id);
                expect(el.destination).to.include(destination.toLowerCase());
            });
    });

    it('should search requesters requests for their manager using the request ID',
        async () => {
            const userDetails = { id: 1, email: 'bola.akin@email.com', role: 'manager' };
            const userToken = JWTService.generateToken(userDetails);
            const requestId = 6;
            const res = await chai.request(app)
                .get(`${requestEndpoint}?request_id=${requestId}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send();
            
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys('status', 'data');
            expect(res.body.status).to.equal('success');
            expect(res.body.data).to.be.an('array');
            expect(res.body.data).to.be.lengthOf(1);
            expect(res.body.data[0]).to.have.property('user_id');
            expect(res.body.data[0]).to.have.property('id');
            // User 3, 4, and 9 are managed by user 1
            expect([3, 4, 9]).to.include(res.body.data[0].user_id);
            expect(res.body.data[0].id).to.equal(requestId);
    });

    it('should search a requester\'s requests for his/her manager using the owner email',
        async () => {
            const userDetails = { id: 1, email: 'bola.akin@email.com', role: 'manager' };
            const userToken = JWTService.generateToken(userDetails);
            const ownerEmail = 'john_doe@email';
            const res = await chai.request(app)
                .get(`${requestEndpoint}?owner=${encodeURIComponent(ownerEmail)}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send();
            
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys('status', 'data');
            expect(res.body.status).to.equal('success');
            expect(res.body.data).to.be.an('array');
            expect(res.body.data[0]).to.have.property('user_id');
            expect(res.body.data[0]).to.have.property('id');
            res.body.data.forEach((el) => expect(el.user_id).to.equal(3));
    });

    it('should search requesters requests for their manager using duration',
        async () => {
            const userDetails = { id: 1, email: 'bola.akin@email.com', role: 'manager' };
            const userToken = JWTService.generateToken(userDetails);
            const duration = '365';
            const res = await chai.request(app)
                .get(`${requestEndpoint}?duration=${duration}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send();
            
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys('status', 'data');
            expect(res.body.status).to.equal('success');
            expect(res.body.data).to.be.an('array');
            expect(res.body.data).to.not.be.empty;
            expect(res.body.data[0]).to.have.property('user_id');
            expect(res.body.data[0]).to.have.property('departure_date');
            expect(res.body.data[0]).to.have.property('return_date');
            res.body.data.forEach((el) => {
                // User 3, 4, and 9 are managed by user 1
                expect([3, 4, 9]).to.include(el.user_id);
                expect((new Date(el.return_date) - new Date(el.departure_date)) / (24 * 3600000))
                    .to.equal(parseInt(duration, 10));
            });
    });

    it('should search requesters requests for their manager using the start date',
        async () => {
            const userDetails = { id: 1, email: 'bola.akin@email.com', role: 'manager' };
            const userToken = JWTService.generateToken(userDetails);
            const startDate = `${new Date().toISOString().split('T')[0]}`;
            const res = await chai.request(app)
                .get(`${requestEndpoint}?start_date=${encodeURIComponent(startDate)}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send();
            
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys('status', 'data');
            expect(res.body.status).to.equal('success');
            expect(res.body.data).to.be.an('array');
            expect(res.body.data).to.not.be.empty;
            expect(res.body.data[0]).to.have.property('user_id');
            expect(res.body.data[0]).to.have.property('departure_date');
            res.body.data.forEach((el) => {
                // User 3, 4, and 9 are managed by user 1
                expect([3, 4, 9]).to.include(el.user_id);
                expect(el.departure_date).to.equal(startDate);
            });
    });

    it('should search requesters requests for their manager using request status',
        async () => {
            const userDetails = { id: 1, email: 'bola.akin@email.com', role: 'manager' };
            const userToken = JWTService.generateToken(userDetails);
            const requestStatus = 'pending';
            const res = await chai.request(app)
                .get(`${requestEndpoint}?status=${requestStatus}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send();
            
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys('status', 'data');
            expect(res.body.status).to.equal('success');
            expect(res.body.data).to.be.an('array');
            expect(res.body.data).to.not.be.empty;
            expect(res.body.data[0]).to.have.property('user_id');
            expect(res.body.data[0]).to.have.property('status');
            res.body.data.forEach((el) => {
                // User 3, 4, and 9 are managed by user 1
                expect([3, 4, 9]).to.include(el.user_id);
                expect(el.status).to.equal(requestStatus);
            });
    });

    it('should search requesters requests for their manager using category',
        async () => {
            const userDetails = { id: 1, email: 'bola.akin@email.com', role: 'manager' };
            const userToken = JWTService.generateToken(userDetails);
            const category = 'one-way';
            const res = await chai.request(app)
                .get(`${requestEndpoint}?category=${category}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send();
            
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys('status', 'data');
            expect(res.body.status).to.equal('success');
            expect(res.body.data).to.be.an('array');
            expect(res.body.data).to.not.be.empty;
            expect(res.body.data[0]).to.have.property('user_id');
            expect(res.body.data[0]).to.have.property('category');
            res.body.data.forEach((el) => {
                // User 3, 4, and 9 are managed by user 1
                expect([3, 7]).to.include(el.user_id);
                expect(el.category).to.equal(category);
            });
    });

    // Super admin requesting
    it('should search requesters requests for the super admin using origin', async () => {
        const userDetails = { id: 7, email: 'superadmin@barefootnomad.com', role: 'super_admin' };
        const userToken = JWTService.generateToken(userDetails);
        const origin = 'kumasi';
        const res = await chai.request(app)
            .get(`${requestEndpoint}?origin=${origin}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send();
        
        
        
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('status', 'data');
        expect(res.body.status).to.equal('success');
        expect(res.body.data).to.be.an('array');
        // There are two requests overall satisfying this condition as at this time
        expect(res.body.data).to.be.lengthOf(2);
        expect(res.body.data[0]).to.have.property('origin');
        res.body.data.forEach((el) => {
            expect(el.origin.toLowerCase()).to.equal(origin);
        });
    });

    it('should search requesters requests for the super admin using destination', async () => {
        const userDetails = { id: 5, email: 'superadmin@barefootnomad.com', role: 'super_admin' };
        const userToken = JWTService.generateToken(userDetails);
        const destination = 'lome';
        const res = await chai.request(app)
            .get(`${requestEndpoint}?destination=${destination}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send();

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('status', 'data');
        expect(res.body.status).to.equal('success');
        expect(res.body.data).to.be.an('array');
        // There is one request overall satisfying this condition as at this time
        expect(res.body.data).to.be.lengthOf(1);
        expect(res.body.data[0]).to.have.property('destination');
        expect(res.body.data[0].destination).to.include(destination);
    });

    it('should search requesters requests for the super admin using the request ID', async () => {
        const userDetails = { id: 5, email: 'superadmin@barefootnomad.com', role: 'super_admin' };
        const userToken = JWTService.generateToken(userDetails);
        const requestId = 3;
        const res = await chai.request(app)
            .get(`${requestEndpoint}?request_id=${requestId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send();
        
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('status', 'data');
        expect(res.body.status).to.equal('success');
        expect(res.body.data).to.be.an('array');
        expect(res.body.data).to.be.lengthOf(1);
        expect(res.body.data[0]).to.have.property('id');
        expect(res.body.data[0].id).to.equal(requestId);
    });

    it('should search a requester\'s requests for the super admin using the owner email',
        async () => {
            const userDetails = { id: 5, email: 'superadmin@barefootnomad.com', role: 'super_admin' };
            const userToken = JWTService.generateToken(userDetails);
            const ownerEmail = 'john_doe@email';
            const res = await chai.request(app)
                .get(`${requestEndpoint}?owner=${encodeURIComponent(ownerEmail)}`)
                .set('Authorization', `Bearer ${userToken}`)
                .send();
            
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys('status', 'data');
            expect(res.body.status).to.equal('success');
            expect(res.body.data).to.be.an('array');
            expect(res.body.data[0]).to.have.property('user_id');
            expect(res.body.data[0]).to.have.property('id');
            res.body.data.forEach((el) => expect(el.user_id).to.equal(3));
    });

    it('should search requesters requests for the super admin using duration', async () => {
        const userDetails = { id: 5, email: 'superadmin@barefootnomad.com', role: 'super_admin' };
        const userToken = JWTService.generateToken(userDetails);
        const duration = '365';
        const res = await chai.request(app)
            .get(`${requestEndpoint}?duration=${duration}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send();
        
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('status', 'data');
        expect(res.body.status).to.equal('success');
        expect(res.body.data).to.be.an('array');
        // There are two requests overall satisfying this condition as at this time
        expect(res.body.data).to.be.lengthOf(2);
        expect(res.body.data[0]).to.have.property('departure_date');
        expect(res.body.data[0]).to.have.property('return_date');
        res.body.data.forEach((el) => {
            expect((new Date(el.return_date) - new Date(el.departure_date)) / (24 * 3600000))
                .to.equal(parseInt(duration, 10));
        });
    });

    it('should search requesters requests for the super admin using the start date', async () => {
        const userDetails = { id: 5, email: 'superadmin@barefootnomad.com', role: 'super_admin' };
        const userToken = JWTService.generateToken(userDetails);
        const startDate = `${new Date().toISOString().split('T')[0]}`;
        const res = await chai.request(app)
            .get(`${requestEndpoint}?start_date=${encodeURIComponent(startDate)}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send();
        
        const dbRequests = await Request.findAll({ where: { departure_date: startDate } });

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('status', 'data');
        expect(res.body.status).to.equal('success');
        expect(res.body.data).to.be.an('array');
        expect(res.body.data).to.be.lengthOf(dbRequests.length);
        expect(res.body.data[0]).to.have.property('departure_date');
        res.body.data.forEach((el) => {
            expect(el.departure_date).to.equal(startDate);
        });
    });

    it('should search requesters requests for the super admin using request status', async () => {
        const userDetails = { id: 5, email: 'superadmin@barefootnomad.com', role: 'super_admin' };
        const userToken = JWTService.generateToken(userDetails);
        const requestStatus = 'pending';
        const res = await chai.request(app)
            .get(`${requestEndpoint}?status=${requestStatus}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send();
        
        const dbRequests = await Request.findAll({ where: { status: requestStatus } });

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('status', 'data');
        expect(res.body.status).to.equal('success');
        expect(res.body.data).to.be.an('array');
        expect(res.body.data).to.be.lengthOf(dbRequests.length);
        expect(res.body.data[0]).to.have.property('status');
        res.body.data.forEach((el) => {
            expect(el.status).to.equal(requestStatus);
        });
    });

    it('should search requesters requests for the super admin using category', async () => {
        const userDetails = { id: 5, email: 'superadmin@barefootnomad.com', role: 'super_admin' };
        const userToken = JWTService.generateToken(userDetails);
        const category = 'multi-city';
        const res = await chai.request(app)
            .get(`${requestEndpoint}?category=${category}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send();
        
        const dbRequests = await Request.findAll({ where: { category } });

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('status', 'data');
        expect(res.body.status).to.equal('success');
        expect(res.body.data).to.be.an('array');
        expect(res.body.data).to.be.lengthOf(dbRequests.length);
        expect(res.body.data[0]).to.have.property('user_id');
        expect(res.body.data[0]).to.have.property('category');
        res.body.data.forEach((el) => {
            expect(el.category).to.equal(category);
        });
    });
  });

  describe('FAILURE', () => {
    it('should fail to search another requester\'s request for a requester', async () => {
        const userDetails = { id: 9, email: 'dan.spielberg@email.com', role: 'requester' };
        const userToken = JWTService.generateToken(userDetails);
        const res = await chai.request(app)
            .get(`${requestEndpoint}?request_id=2`)
            .set('Authorization', `Bearer ${userToken}`)
            .send();

        expect(res.status).to.equal(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.equal('error');
        expect(res.body.error.message).to.equal(
            'No travel request found that satisfy the query and/or your permisson level');
    });

    it('should fail to search requests for a manager otherwise of a requester\'s manager', async () => {
        const userDetails = { id: 2, email: 'h.milan@email.com', role: 'manager' };
        const userToken = JWTService.generateToken(userDetails);
        const res = await chai.request(app)
            .get(`${requestEndpoint}?request_id=5`)
            .set('Authorization', `Bearer ${userToken}`)
            .send();

        expect(res.status).to.equal(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.equal('error');
        expect(res.body.error.message).to.equal(
            'No travel request found that satisfy the query and/or your permisson level');
    });

    it('should fail to search requests with only invalid parameters supplied', async () => {
        const userDetails = { id: 5, email: 'superadmin@barefootnomad.com', role: 'super_admin' };
        const userToken = JWTService.generateToken(userDetails);
        const res = await chai.request(app)
            .get(`${requestEndpoint}?name=lambda`)
            .set('Authorization', `Bearer ${userToken}`)
            .send();

        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.equal('error');
        expect(res.body.error.message).to.equal('Invalid query parameter(s)');
    });

    it('should fail to search requests using invalid duration', async () => {
        const userDetails = { id: 5, email: 'superadmin@barefootnomad.com', role: 'super_admin' };
        const userToken = JWTService.generateToken(userDetails);
        const res = await chai.request(app)
            .get(`${requestEndpoint}?duration=${encodeURIComponent('days 500')}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send();
        
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.equal('error');
        expect(res.body.error).to.have.property('duration');
        expect(res.body.error.duration).to.equal(
            'Invalid duration value. Please ensure it is a whole number (note: it is assumed to be in days).');
    });
    
    it('should fail to search requests using non-existing duration', async () => {
        const userDetails = { id: 5, email: 'superadmin@barefootnomad.com', role: 'super_admin' };
        const userToken = JWTService.generateToken(userDetails);
        const res = await chai.request(app)
            .get(`${requestEndpoint}?duration=900`)
            .set('Authorization', `Bearer ${userToken}`)
            .send();
        
        expect(res.status).to.equal(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.equal('error');
        expect(res.body.error.message).to.equal(
            'No travel request found that satisfy the query and/or your permisson level');
        });
        
    // request ID, owner, destination, origin, duration, start date, request status etc
    it('should fail to search requests using invalid/non-existing request ID', async () => {
        const userDetails = { id: 5, email: 'superadmin@barefootnomad.com', role: 'super_admin' };
        const userToken = JWTService.generateToken(userDetails);
        const res = await chai.request(app)
            .get(`${requestEndpoint}?request_id=900`)
            .set('Authorization', `Bearer ${userToken}`)
            .send();
        
        expect(res.status).to.equal(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.equal('error');
        expect(res.body.error.message).to.equal(
            'No travel request found that satisfy the query and/or your permisson level');
    });

    it('should fail to search requests using invalid/non-existing owner', async () => {
        const userDetails = { id: 5, email: 'superadmin@barefootnomad.com', role: 'super_admin' };
        const userToken = JWTService.generateToken(userDetails);
        const res = await chai.request(app)
            .get(`${requestEndpoint}?owner=900`)
            .set('Authorization', `Bearer ${userToken}`)
            .send();
        
        expect(res.status).to.equal(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.equal('error');
        expect(res.body.error.message).to.equal(
            'No travel request found that satisfy the query and/or your permisson level');
    });

    it('should fail to search requests using invalid/non-existing destination', async () => {
        const userDetails = { id: 5, email: 'superadmin@barefootnomad.com', role: 'super_admin' };
        const userToken = JWTService.generateToken(userDetails);
        const res = await chai.request(app)
            .get(`${requestEndpoint}?destination=antartica`)
            .set('Authorization', `Bearer ${userToken}`)
            .send();
        
        expect(res.status).to.equal(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.equal('error');
        expect(res.body.error.message).to.equal(
            'No travel request found that satisfy the query and/or your permisson level');
    });

    it('should fail to search requests using invalid/non-existing origin', async () => {
        const userDetails = { id: 5, email: 'superadmin@barefootnomad.com', role: 'super_admin' };
        const userToken = JWTService.generateToken(userDetails);
        const res = await chai.request(app)
            .get(`${requestEndpoint}?origin=mars`)
            .set('Authorization', `Bearer ${userToken}`)
            .send();
        
        expect(res.status).to.equal(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.equal('error');
        expect(res.body.error.message).to.equal(
            'No travel request found that satisfy the query and/or your permisson level');
    });

    it('should fail to search requests using invalid/non-existing start date', async () => {
        const userDetails = { id: 5, email: 'superadmin@barefootnomad.com', role: 'super_admin' };
        const userToken = JWTService.generateToken(userDetails);
        const res = await chai.request(app)
            .get(`${requestEndpoint}?start_date=19000210`)
            .set('Authorization', `Bearer ${userToken}`)
            .send();
        
        expect(res.status).to.equal(404);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.equal('error');
        expect(res.body.error.message).to.equal(
            'No travel request found that satisfy the query and/or your permisson level');
    });

    it('should fail to search requests using invalid request status', async () => {
        const userDetails = { id: 5, email: 'superadmin@barefootnomad.com', role: 'super_admin' };
        const userToken = JWTService.generateToken(userDetails);
        const res = await chai.request(app)
            .get(`${requestEndpoint}?status=hanging`)
            .set('Authorization', `Bearer ${userToken}`)
            .send();
        
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.equal('error');
        expect(res.body.error).to.have.property('status');
        expect(res.body.error.status).to.equal(
            'Invalid request status value. Please choose one of "pending", "approved", and "declined"');
    });

    it('should fail to search requests using invalid category', async () => {
        const userDetails = { id: 5, email: 'superadmin@barefootnomad.com', role: 'super_admin' };
        const userToken = JWTService.generateToken(userDetails);
        const res = await chai.request(app)
            .get(`${requestEndpoint}?category=up-and-down`)
            .set('Authorization', `Bearer ${userToken}`)
            .send();
        
        expect(res.status).to.equal(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.keys('status', 'error');
        expect(res.body.status).to.equal('error');
        expect(res.body.error).to.have.property('category');
        expect(res.body.error.category).to.equal(
            'Invalid request category value. Please choose one of "one-way", "round-trip", and "multi-city"');
    });
  });
});