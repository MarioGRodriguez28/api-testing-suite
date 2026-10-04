const {
  expectValidUser,
  expectValidPost,
  expectValidComment,
  testDataGenerator,
} = require('../src/test-helpers');

describe('test helpers', () => {
  it('generates a post for the default user', () => {
    expect(testDataGenerator.generatePost().userId).toBe(1);
  });

  it('generates a post for a given user', () => {
    expect(testDataGenerator.generatePost(7).userId).toBe(7);
  });

  it('generates a user that passes validation', () => {
    const user = testDataGenerator.generateUser();

    expectValidUser({ id: 1, ...user });
  });

  it('accepts valid entities', () => {
    expectValidPost({ id: 1, userId: 1, title: 't', body: 'b' });
    expectValidComment({ postId: 1, id: 1, name: 'n', email: 'a@b.co', body: 'b' });
  });

  it('rejects an invalid user', () => {
    expect(() => expectValidUser({ id: 1, name: 'x', username: 'u', email: 'bad' })).toThrow();
  });
});
