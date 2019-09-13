import { expect } from 'chai';
import isAfterDate from '../utils/isAfterDate.utils';

describe('isAfterDate', () => {
  it('should return true when value of input date is after date', () => {
    const check = isAfterDate('2019-10-04','2019-09-30');

    expect(check).to.equal(true);
  });

  it('should throw an error value if input date is before date', () => {
    expect(() => isAfterDate('2019-09-12','2019-10-13')).to.throw('');
  });

});