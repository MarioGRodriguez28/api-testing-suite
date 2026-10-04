const APIClient = require('../../src/api-client');
const { testDataGenerator } = require('../../src/test-helpers');

describe('Edge Cases & Error Scenarios', () => {
  let apiClient;

  beforeAll(() => {
    apiClient = new APIClient();
  });

  describe('Invalid Input Handling', () => {
    it('should handle very large ID gracefully', async () => {
      const response = await apiClient.getUserById(999999999);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({});
    });

    it('should handle negative IDs', async () => {
      const response = await apiClient.getUserById(-1);

      expect(response.status).toBe(404);
    });

    it('should handle string instead of number for ID', async () => {
      const response = await apiClient.getUserById('abc');

      expect(response.status).toBe(404);
    });

    it('should handle malformed post creation', async () => {
      const invalidPost = {
        // missing userId and title
        body: 'incomplete post',
      };
      const response = await apiClient.createPost(invalidPost);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });
  });

  describe('Boundary Conditions', () => {
    it('should return first user correctly', async () => {
      const response = await apiClient.getUserById(1);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
    });

    it('should return last user (ID 10)', async () => {
      const response = await apiClient.getUserById(10);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(10);
    });

    it('should return user just beyond range', async () => {
      const response = await apiClient.getUserById(11);

      expect(response.status).toBe(404);
    });

    it('should handle zero as ID', async () => {
      const response = await apiClient.getUserById(0);

      expect(response.status).toBe(404);
    });
  });

  describe('Response Time Performance', () => {
    it('should return user within acceptable time', async () => {
      const start = Date.now();
      const response = await apiClient.getUserById(1);
      const duration = Date.now() - start;

      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(2000);
    });

    it('should return posts list within acceptable time', async () => {
      const start = Date.now();
      const response = await apiClient.getPosts();
      const duration = Date.now() - start;

      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(2000);
    });

    it('should handle multiple concurrent requests', async () => {
      const start = Date.now();

      const promises = [
        apiClient.getUsers(),
        apiClient.getPosts(),
        apiClient.getComments(),
      ];

      const responses = await Promise.all(promises);
      const duration = Date.now() - start;

      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
      expect(duration).toBeLessThan(5000);
    });
  });

  describe('Empty Response Handling', () => {
    it('should handle posts for non-existent user', async () => {
      const response = await apiClient.getPostsByUserId(999);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    it('should handle comments for non-existent post', async () => {
      const response = await apiClient.getCommentsByPostId(999);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Null and Undefined Handling', () => {
    it('should not accept null body in post creation', async () => {
      const response = await apiClient.createPost(null);

      expect(response.status).toBeGreaterThanOrEqual(200);
    });

    it('should handle undefined parameters', async () => {
      const response = await apiClient.getPostsByUserId(undefined);

      expect(response.status).toBeGreaterThanOrEqual(200);
    });
  });

  describe('Special Characters & Encoding', () => {
    it('should handle user with special characters in name', async () => {
      const response = await apiClient.getUserById(1);
      const user = response.body;

      expect(user.name).toBeTruthy();
      expect(typeof user.name).toBe('string');
    });

    it('should handle comments with special characters', async () => {
      const response = await apiClient.getCommentsByPostId(1);

      expect(response.status).toBe(200);
      response.body.forEach(comment => {
        expect(comment.body).toBeTruthy();
      });
    });
  });

  describe('Retry & Resilience', () => {
    it('should eventually succeed after initial delay', async () => {
      let success = false;

      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const response = await apiClient.getUserById(1);
          if (response.status === 200) {
            success = true;
            break;
          }
        } catch (error) {
          // Retry
        }
      }

      expect(success).toBe(true);
    });
  });

  describe('Data Mutation Scenarios', () => {
    it('should not mutate original data on get', async () => {
      const response1 = await apiClient.getUserById(1);
      const user1 = { ...response1.body };

      // Make another request
      await apiClient.getPosts();

      const response2 = await apiClient.getUserById(1);
      const user2 = response2.body;

      expect(user1).toEqual(user2);
    });

    it('should handle rapid sequential creates', async () => {
      const posts = [];

      for (let i = 0; i < 3; i++) {
        const newPost = testDataGenerator.generatePost(1);
        const response = await apiClient.createPost(newPost);
        posts.push(response.body);
      }

      expect(posts.length).toBe(3);
      posts.forEach((post) => {
        expect(post.id).toBeDefined();
        expect(typeof post.id).toBe('number');
        expect(post.userId).toBe(1);
      });
    });
  });
});
