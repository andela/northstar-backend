import chai from 'chai';
import chaiHttp from 'chai-http';

const { expect } = chai;

chai.use(chaiHttp);

// A simple test case to test proper setup
describe('Basic Mocha String Test', () => {
  it('should return number of charachters in a string', () => {
    expect(2).to.equal(2);
  });
  it('should return first charachter of the string', () => {
    expect(2).to.not.equal(1);
  });
});
