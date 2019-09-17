import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import Sinonchai from 'sinon-chai';
import app from '../../index';
import RequestController from '../../controllers/request.controller';
import JWTService from '../../services/jwt.service';
import sgMail from '@sendgrid/mail';

chai.use(Sinonchai);
chai.use(chaiHttp);
chai.should();
const { expect } = chai;

const userDetails = { id: 3, role: 'requester' };          
const userToken = JWTService.generateToken(userDetails);

describe("Requests", () => {
 let token;
 before("signup to get access userToken", async () => {
   const user = {
     email: "chiwe@gmail.com",
     first_name: "Chinwe",
     last_name: "Okonkwo",
     password: "secret123",
     role: "requester",
     gender: "female",
     birth_date: "02-02-2019",
     preferred_language: "english",
     preferred_currency: "USD",
     location: "lagos"
   };
  
   const userRes = await chai
     .request(app)
     .post("/api/v1/auth/signup")
     .set('Authorization', `Bearer ${userToken}`)
     .send(user);
   token = userRes.body.data.token;
 });
 describe("/POST multi city request", () => {
   const requestData = {
    category: "multi-city",
    origin: "Awka",
    destination: ["lagos","benin"],
    departure_date: "02-02-2020",
    return_date: "12-20-2019",
    reason: "Holiday",
    booking_id: 1
  };
   it("it should successfully create a multy city request trip", done => {
      chai
       .request(app)
       .post("/api/v1/request/multi-city")
       .send(requestData)
       .set('Authorization', `Bearer ${userToken}`)
       .end((err, res) => {
         expect(res).to.be.an("object");
         expect(res.status).to.equal(201);
         expect(res.body).to.have.keys("status", "data");
         expect(res.body.status).to.deep.equals("success");
         expect(res.body.data).to.be.an("object");
         expect(res.body.data).to.have.keys("request");
         expect(res.body.data.request).to.be.an("object");            
         done();
       });
   });
   it("it should return token not found error", done => {
     chai
       .request(app)
       .post("/api/v1/request/multi-city")
       .send(requestData)
       .end((err, res) => {
         expect(res).to.be.an("object");
         expect(res.status).to.equal(403);
         expect(res.body).to.have.keys("status", "error");
         expect(res.body.status).to.deep.equals("error");        
         done();
       });
   });
   it("it should return invalid token error", done => {
     chai
       .request(app)
       .post("/api/v1/request/multi-city")
       .send(requestData)
       .set("authorization", `Bearer gerbtssbdrydrybbdrbytr`)
       .end((err, res) => {
         expect(res).to.be.an("object");
         expect(res.status).to.equal(400);
         expect(res.body).to.have.keys("status", "error");
         expect(res.body.status).to.deep.equals("error");         
         done();
       });
   });
   it('fakes server error', (done) => {
     const req = { body: {} };
     const res = {
       status() { },
       send() { }
     };
     sinon.stub(res, 'status').returnsThis();
     RequestController.createMultiCityRequest(req, res);    
     done();
   });
 });
});
