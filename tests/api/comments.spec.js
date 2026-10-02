const APIClient = require('../../src/api-client');
const { expectValidComment } = require('../../src/test-helpers');

describe('Comments API', () => {
  let apiClient;

  beforeAll(() => {
    apiClient = new APIClient();
  });

  describe('GET /comments', () => {
    it('should return a list of comments', async () => {
      const response = await apiClient.getComments();

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return comments with valid structure', async () => {
      const response = await apiClient.getComments();

      response.body.slice(0, 5).forEach(comment => {
        expectValidComment(comment);
      });
    });

    it('should return 500 comments', async () => {
      const response = await apiClient.getComments();

      expect(response.body.length).toBe(500);
    });
  });

  describe('GET /comments?postId=:id', () => {
    it('should return comments filtered by post ID', async () => {
      const postId = 1;
      const response = await apiClient.getCommentsByPostId(postId);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach(comment => {
        expect(comment.postId).toBe(postId);
      });
    });

    it('should return multiple comments per post', async () => {
      const response = await apiClient.getCommentsByPostId(1);

      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body.length).toBeLessThanOrEqual(5);
    });

    it('should have required comment properties', async () => {
      const response = await apiClient.getCommentsByPostId(1);

      expect(response.body.length).toBeGreaterThan(0);
      const firstComment = response.body[0];
      expect(firstComment.name).toBeTruthy();
      expect(firstComment.email).toBeTruthy();
      expect(firstComment.body).toBeTruthy();
    });

    it('should have valid email format in comments', async () => {
      const response = await apiClient.getCommentsByPostId(1);

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      response.body.forEach(comment => {
        expect(comment.email).toMatch(emailRegex);
      });
    });
  });

  describe('Comments data validation', () => {
    it('should have consistent comment data across requests', async () => {
      const postId = 1;
      const response1 = await apiClient.getCommentsByPostId(postId);
      const response2 = await apiClient.getCommentsByPostId(postId);

      expect(response1.body).toEqual(response2.body);
    });

    it('all comments should have unique IDs', async () => {
      const response = await apiClient.getComments();
      const ids = response.body.map(comment => comment.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should not have empty comment bodies', async () => {
      const response = await apiClient.getComments();

      response.body.slice(0, 50).forEach(comment => {
        expect(comment.body.trim().length).toBeGreaterThan(0);
      });
    });
  });
});
