import { expect } from 'chai';
import isBeforeDate from '../utils/isBeforeDate.utils';

describe('isBeforeDate', () => {
  it('should return true when date is before actual date', () => {
    const check = isBeforeDate('2019-09-04','2019-10-04');

    expect(check).to.equal(true);
  });

  it('should throw an error when date is not before actual date', () => {
    expect(() => isBeforeDate('2019-10-04','2019-09-04')).to.throw();
  });
})
