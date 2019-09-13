import { expect } from 'chai';
import isBeforeDate from '../utils/isBeforeDate.utils';

describe('isBeforeDate', () => {
  it('should return true when value of input date is before date', () => {
    const check = isBeforeDate('2019-09-13','2019-10-04');
console.log();

    expect(check).to.equal(true);
  });

  it('should throw an error when if input date is after date', () => {
    expect(() => isBeforeDate('2019-10-04','2019-09-13')).to.throw('');
  });

});