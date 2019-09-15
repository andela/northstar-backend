import { expect } from 'chai';
import isArrayOfValidStrings from '../utils/isArrayOfValidStrings.utils';

describe('isValidArray', () => {
  it('should return true for an array of strings', () => {
    const check = isArrayOfValidStrings(['hello','world'], 'invalid array');

    expect(check).to.eql(true);
  });

  it('should return true for a stringified array of strings', () => {
    const check = isArrayOfValidStrings("['hello','world']", 'invalid array');

    expect(check).to.eql(true);
  });

  it('should throw an error for an array of non-strings', () => {
    expect(() => isArrayOfValidStrings(['hello', null])).to.throw();
  });

  it('should throw an error for an invalid array', () => {
    expect(() => isArrayOfValidStrings(2)).to.throw();
  });
});