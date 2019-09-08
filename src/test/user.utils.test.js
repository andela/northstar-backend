import chai from 'chai';
import UserUtils from '../utils/user.utils';

const { getValuesToUpdate } = UserUtils;

const { expect } = chai;

describe('getValuesToUpdate()', () => {
  it('Should ignore values values not needed', () => {
    const reqBody = { office: 'Lagos' };
    expect(getValuesToUpdate(reqBody)).to.be.empty.and.an('object');
  });

  it('Should return "first_name" and "last_name" only', () => {
    const reqBody = {
      first_name: 'Sam',
      last_name: 'Tally',
      invalid: 'should not return'
    };
    expect(getValuesToUpdate(reqBody)).to.have.keys('first_name', 'last_name');
  });
});
