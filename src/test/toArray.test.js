import { expect } from 'chai';
import toArray from '../utils/toArray.utils';

describe('toArray', () => {
  it('should return true for an array of strings', () => {
    const check = toArray('hello');

    expect(check).to.eql(['hello']);
  });

});