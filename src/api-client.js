const request = require('supertest');

const BASE_URL = 'https://jsonplaceholder.typicode.com';

class APIClient {
  constructor(baseUrl = BASE_URL) {
    this.baseUrl = baseUrl;
    this.client = request(baseUrl);
  }

  async getUsers() {
    return this.client.get('/users');
  }

  async getUserById(id) {
    return this.client.get(`/users/${id}`);
  }

  async getPosts() {
    return this.client.get('/posts');
  }

  async getPostById(id) {
    return this.client.get(`/posts/${id}`);
  }

  async getPostsByUserId(userId) {
    return this.client.get(`/posts?userId=${userId}`);
  }

  async createPost(postData) {
    return this.client
      .post('/posts')
      .send(postData);
  }

  async updatePost(id, postData) {
    return this.client
      .put(`/posts/${id}`)
      .send(postData);
  }

  async deletePost(id) {
    return this.client.delete(`/posts/${id}`);
  }

  async getComments() {
    return this.client.get('/comments');
  }

  async getCommentsByPostId(postId) {
    return this.client.get(`/comments?postId=${postId}`);
  }
}

module.exports = APIClient;
