import { expect } from 'chai';
import isNotEmpty from '../utils/isNotEmpty.utils';

describe('notEmpty', () => {
  it('should return true when value is not empty', () => {
    const check = isNotEmpty('yes', 'string field cannot be left blank');

    expect(check).to.equal(true);
  });

  it('should throw an error when value is empty', () => {
    expect(() => isNotEmpty('', 'string field cannot be left blank')).to.throw('string field cannot be left blank');
  });
});