const APIClient = require('../../src/api-client');
const { expectValidPost, testDataGenerator } = require('../../src/test-helpers');

describe('Posts API', () => {
  let apiClient;

  beforeAll(() => {
    apiClient = new APIClient();
  });

  describe('GET /posts', () => {
    it('should return a list of posts', async () => {
      const response = await apiClient.getPosts();

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return posts with valid structure', async () => {
      const response = await apiClient.getPosts();

      response.body.slice(0, 5).forEach(post => {
        expectValidPost(post);
      });
    });

    it('should return 100 posts', async () => {
      const response = await apiClient.getPosts();

      expect(response.body.length).toBe(100);
    });
  });

  describe('GET /posts/:id', () => {
    it('should return a specific post by ID', async () => {
      const postId = 1;
      const response = await apiClient.getPostById(postId);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(postId);
      expectValidPost(response.body);
    });

    it('should have required post properties', async () => {
      const response = await apiClient.getPostById(1);

      expect(response.body.title).toBeTruthy();
      expect(response.body.body).toBeTruthy();
      expect(response.body.title.length).toBeGreaterThan(0);
      expect(response.body.body.length).toBeGreaterThan(0);
    });

    it('should return 404 for non-existent post', async () => {
      const response = await apiClient.getPostById(999);

      expect(response.status).toBe(404);
    });
  });

  describe('GET /posts?userId=:id', () => {
    it('should return posts filtered by user ID', async () => {
      const userId = 1;
      const response = await apiClient.getPostsByUserId(userId);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach(post => {
        expect(post.userId).toBe(userId);
      });
    });

    it('should return 10 posts per user', async () => {
      const response = await apiClient.getPostsByUserId(1);

      expect(response.body.length).toBe(10);
    });
  });

  describe('POST /posts (Create)', () => {
    it('should create a new post successfully', async () => {
      const newPost = testDataGenerator.generatePost(1);
      const response = await apiClient.createPost(newPost);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(newPost.title);
      expect(response.body.body).toBe(newPost.body);
    });

    it('should return an ID for the created post', async () => {
      const newPost = testDataGenerator.generatePost(1);
      const response = await apiClient.createPost(newPost);

      expect(typeof response.body.id).toBe('number');
      expect(response.body.id).toBeGreaterThan(0);
    });

    it('should preserve post data on creation', async () => {
      const newPost = testDataGenerator.generatePost(2);
      const response = await apiClient.createPost(newPost);

      expect(response.body.userId).toBe(newPost.userId);
      expect(response.body.title).toBe(newPost.title);
      expect(response.body.body).toBe(newPost.body);
    });
  });

  describe('PUT /posts/:id (Update)', () => {
    it('should update an existing post', async () => {
      const postId = 1;
      const updatedData = {
        title: 'Updated Title',
        body: 'Updated body content',
        userId: 1,
      };
      const response = await apiClient.updatePost(postId, updatedData);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(updatedData.title);
      expect(response.body.body).toBe(updatedData.body);
    });

    it('should preserve post ID on update', async () => {
      const postId = 5;
      const response = await apiClient.updatePost(postId, {
        title: 'New Title',
      });

      expect(response.body.id).toBe(postId);
    });
  });

  describe('DELETE /posts/:id', () => {
    it('should delete a post successfully', async () => {
      const postId = 1;
      const response = await apiClient.deletePost(postId);

      expect(response.status).toBe(200);
    });

    it('should return empty object on delete', async () => {
      const response = await apiClient.deletePost(2);

      expect(typeof response.body).toBe('object');
    });
  });

  describe('Post data consistency', () => {
    it('should maintain consistent post data', async () => {
      const response1 = await apiClient.getPostById(1);
      const response2 = await apiClient.getPostById(1);

      expect(response1.body).toEqual(response2.body);
    });

    it('all posts should have unique IDs', async () => {
      const response = await apiClient.getPosts();
      const ids = response.body.map(post => post.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(ids.length);
    });
  });
});
