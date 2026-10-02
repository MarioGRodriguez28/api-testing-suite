const APIClient = require('../../src/api-client');
const { expectValidUser } = require('../../src/test-helpers');

describe('Users API', () => {
  let apiClient;

  beforeAll(() => {
    apiClient = new APIClient();
  });

  describe('GET /users', () => {
    it('should return a list of users', async () => {
      const response = await apiClient.getUsers();

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return users with valid structure', async () => {
      const response = await apiClient.getUsers();

      response.body.forEach(user => {
        expectValidUser(user);
      });
    });

    it('should return correct number of users', async () => {
      const response = await apiClient.getUsers();

      expect(response.body.length).toBe(10);
    });
  });

  describe('GET /users/:id', () => {
    it('should return a specific user by ID', async () => {
      const userId = 1;
      const response = await apiClient.getUserById(userId);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(userId);
      expectValidUser(response.body);
    });

    it('should return 404 for non-existent user', async () => {
      const response = await apiClient.getUserById(999);

      expect(response.status).toBe(404);
    });

    it('should have required user properties', async () => {
      const response = await apiClient.getUserById(1);
      const user = response.body;

      expect(user).toHaveProperty('address');
      expect(user).toHaveProperty('company');
      expect(user).toHaveProperty('phone');
      expect(user).toHaveProperty('website');
    });

    it('should have valid address structure', async () => {
      const response = await apiClient.getUserById(1);
      const { address } = response.body;

      expect(address).toHaveProperty('street');
      expect(address).toHaveProperty('city');
      expect(address).toHaveProperty('geo');
      expect(address.geo).toHaveProperty('lat');
      expect(address.geo).toHaveProperty('lng');
    });
  });

  describe('User data consistency', () => {
    it('should have consistent user data across multiple requests', async () => {
      const response1 = await apiClient.getUserById(1);
      const response2 = await apiClient.getUserById(1);

      expect(response1.body).toEqual(response2.body);
    });

    it('all users should have unique IDs', async () => {
      const response = await apiClient.getUsers();
      const ids = response.body.map(user => user.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(ids.length);
    });
  });
});
