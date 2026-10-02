function expectValidUser(user) {
  expect(user).toHaveProperty('id');
  expect(user).toHaveProperty('name');
  expect(user).toHaveProperty('email');
  expect(user).toHaveProperty('username');
  expect(user.id).toBeDefined();
  expect(typeof user.name).toBe('string');
  expect(typeof user.email).toBe('string');
  expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
}

function expectValidPost(post) {
  expect(post).toHaveProperty('id');
  expect(post).toHaveProperty('userId');
  expect(post).toHaveProperty('title');
  expect(post).toHaveProperty('body');
  expect(typeof post.id).toBe('number');
  expect(typeof post.userId).toBe('number');
  expect(typeof post.title).toBe('string');
  expect(typeof post.body).toBe('string');
}

function expectValidComment(comment) {
  expect(comment).toHaveProperty('postId');
  expect(comment).toHaveProperty('id');
  expect(comment).toHaveProperty('name');
  expect(comment).toHaveProperty('email');
  expect(comment).toHaveProperty('body');
  expect(typeof comment.postId).toBe('number');
  expect(typeof comment.id).toBe('number');
}

const testDataGenerator = {
  generatePost: (userId = 1) => ({
    userId,
    title: `Test Post ${Date.now()}`,
    body: 'This is a test post body',
  }),

  generateUser: () => ({
    name: `Test User ${Date.now()}`,
    email: `user${Date.now()}@test.com`,
    username: `testuser${Date.now()}`,
  }),
};

module.exports = {
  expectValidUser,
  expectValidPost,
  expectValidComment,
  testDataGenerator,
};
