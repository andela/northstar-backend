import { expect } from 'chai';
import isAfterDate from '../utils/isAfterDate.utils';

describe('isBeforeDate', () => {
  it('should return true when date is after actual date', () => {
    const check = isAfterDate('2019-11-04','2019-10-04');

    expect(check).to.equal(true);
  });

  it('should throw an error when date is not after actual date', () => {
    expect(() => isAfterDate('2019-09-04','2019-10-04')).to.throw();
  });
})
