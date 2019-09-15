import { expect } from 'chai';
import toArray from '../utils/toArray.utils';

describe('toArray', () => {
  it('should turn a string into an array', () => {
    const check = toArray('hello');

    expect(check).to.eql(['hello']);
  });

  it('should not convert an already formed array', () => {
    const check = toArray(['hello']);

    expect(check).to.eql(['hello']);
  });

  it('should return an empty array if neither an array nor a string is passed in', () => {
    const check = toArray({});

    expect(check).to.eql([]);
  });
});