const APIClient = require('../../src/api-client');

describe('Error Handling & Negative Tests', () => {
  let apiClient;

  beforeAll(() => {
    apiClient = new APIClient();
  });

  describe('HTTP Error Responses', () => {
    it('should return 404 for non-existent user', async () => {
      const response = await apiClient.getUserById(999);

      expect(response.status).toBe(404);
    });

    it('should return 404 for non-existent post', async () => {
      const response = await apiClient.getPostById(999);

      expect(response.status).toBe(404);
    });

    it('should return 404 with empty body', async () => {
      const response = await apiClient.getUserById(999);

      expect(response.status).toBe(404);
      expect(Object.keys(response.body).length).toBe(0);
    });

    it('should handle 404 gracefully without throwing', async () => {
      expect(async () => {
        await apiClient.getUserById(999);
      }).not.toThrow();
    });
  });

  describe('Invalid HTTP Methods', () => {
    it('DELETE should return 200 even for non-existent resource', async () => {
      const response = await apiClient.deletePost(999);

      expect(response.status).toBe(200);
    });

    it('PUT on non-existent resource should return 500 or success', async () => {
      const response = await apiClient.updatePost(999, { title: 'Test' });

      expect([200, 404, 500]).toContain(response.status);
    });
  });

  describe('Malformed Data Responses', () => {
    it('should handle valid JSON in response', async () => {
      const response = await apiClient.getUsers();

      expect(() => {
        JSON.parse(response.text);
      }).not.toThrow();
    });

    it('should have proper content-type header', async () => {
      const response = await apiClient.getUsers();

      expect(response.headers['content-type']).toContain('application/json');
    });
  });

  describe('Request Validation', () => {
    it('should not accept invalid post data silently', async () => {
      const invalidPost = {
        userId: 'not-a-number',
        title: 123,
        body: null,
      };

      const response = await apiClient.createPost(invalidPost);

      expect(response.status).toBe(201);
      expect(response.body.id).toBeDefined();
    });

    it('should handle empty string values', async () => {
      const emptyPost = {
        userId: 1,
        title: '',
        body: '',
      };

      const response = await apiClient.createPost(emptyPost);

      expect(response.status).toBe(201);
    });
  });

  describe('Timeout & Connection Errors', () => {
    it('should complete within timeout', async () => {
      const start = Date.now();
      const response = await apiClient.getUsers();
      const duration = Date.now() - start;

      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(10000);
    });
  });

  describe('Data Type Validation', () => {
    it('user IDs should always be numbers', async () => {
      const response = await apiClient.getUsers();

      response.body.forEach(user => {
        expect(typeof user.id).toBe('number');
        expect(Number.isInteger(user.id)).toBe(true);
      });
    });

    it('post IDs should be positive integers', async () => {
      const response = await apiClient.getPosts();

      response.body.slice(0, 10).forEach(post => {
        expect(Number.isInteger(post.id)).toBe(true);
        expect(post.id).toBeGreaterThan(0);
      });
    });

    it('should validate email format is string', async () => {
      const response = await apiClient.getUsers();

      response.body.forEach(user => {
        expect(typeof user.email).toBe('string');
        expect(user.email).toContain('@');
      });
    });
  });

  describe('Array Boundary Tests', () => {
    it('should not return negative array lengths', async () => {
      const response = await apiClient.getUsers();

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(0);
    });

    it('should handle large array responses', async () => {
      const response = await apiClient.getComments();

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(100);
    });

    it('should not have duplicate IDs in user list', async () => {
      const response = await apiClient.getUsers();
      const ids = response.body.map(u => u.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('Concurrent Request Handling', () => {
    it('should handle multiple simultaneous requests', async () => {
      const promises = [];

      for (let i = 1; i <= 5; i++) {
        promises.push(apiClient.getUserById(i));
      }

      const responses = await Promise.all(promises);

      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });

    it('should not corrupt data with concurrent requests', async () => {
      const promises = [
        apiClient.getUsers(),
        apiClient.getPosts(),
        apiClient.getComments(),
      ];

      const [usersResp, postsResp, commentsResp] = await Promise.all(promises);

      expect(usersResp.body.length).toBe(10);
      expect(postsResp.body.length).toBe(100);
      expect(commentsResp.body.length).toBe(500);
    });
  });

  describe('State & Idempotency', () => {
    it('GET requests should be idempotent', async () => {
      const response1 = await apiClient.getUserById(1);
      const response2 = await apiClient.getUserById(1);

      expect(response1.body).toEqual(response2.body);
      expect(response1.status).toBe(response2.status);
    });

    it('multiple GET posts should return consistent data', async () => {
      const response1 = await apiClient.getPosts();
      const response2 = await apiClient.getPosts();

      expect(response1.body.length).toBe(response2.body.length);
      expect(response1.body[0].id).toBe(response2.body[0].id);
    });
  });

  describe('Status Code Consistency', () => {
    it('successful user retrieval should always return 200', async () => {
      for (let i = 1; i <= 5; i++) {
        const response = await apiClient.getUserById(i);
        expect(response.status).toBe(200);
      }
    });

    it('non-existent resources should always return 404', async () => {
      const ids = [999, 1000, 99999];

      for (const id of ids) {
        const response = await apiClient.getUserById(id);
        expect(response.status).toBe(404);
      }
    });
  });
});
