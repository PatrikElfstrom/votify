import utils from './utils';

const mockMath = Object.create(global.Math);
mockMath.random = () => 0.4264782917303651;
global.Math = mockMath;

describe('utils.random', () => {
  it('should return a string', () => {
    expect(typeof utils.random()).toBe('string');
  });

  it('should return a random string', () => {
    expect(utils.random()).toBe('fcprrg4jfyi');
  });
});
