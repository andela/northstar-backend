import chai from 'chai';
import chaiHttp from 'chai-http';
import isNotEmpty from '../utils/isNotEmpty.utils';

chai.use(chaiHttp);
chai.should();

const { expect } = chai;

describe('isNotEmpty', () => {
  it('should return true when value is not empty', () => {
    const check = isNotEmpty('yes', 'string field cannot be left blank');

    expect(check).to.equal(true);
  });

  it('should throw an error when value is empty', () => {
    expect(() => isNotEmpty('', 'string field cannot be left blank')).to.throw('string field cannot be left blank');
  });
});