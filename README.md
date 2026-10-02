# API Testing Suite

A comprehensive test suite demonstrating professional QA automation practices using Jest and Supertest against the JSONPlaceholder public API.

## Overview

This project showcases enterprise-level testing patterns including:

- ✅ **Unit & Integration Tests**: Comprehensive coverage of API endpoints
- ✅ **Custom Test Helpers**: Reusable validation patterns and test data generators
- ✅ **CI/CD Pipeline**: Automated testing on every commit (GitHub Actions)
- ✅ **Fixture Architecture**: Consistent test data generation
- ✅ **Coverage Thresholds**: Enforced code quality standards (70%+ coverage)
- ✅ **Error Handling**: Validation of error cases and edge conditions

## Technology Stack

- **Test Framework**: Jest
- **HTTP Client**: Supertest
- **API**: JSONPlaceholder (public test API)
- **CI/CD**: GitHub Actions
- **Node.js**: v16+

## Quick Start

### Installation

```bash
npm install
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage report
npm run test:coverage

# Run specific test suites
npm run test:api
```

## Test Coverage

### Users API Tests
- ✅ Fetch all users
- ✅ Validate user structure
- ✅ Fetch single user by ID
- ✅ Handle 404 responses
- ✅ Verify address and company properties
- ✅ Data consistency validation
- ✅ Unique ID verification

**Tests**: 7 | **Assertions**: 15+

### Posts API Tests
- ✅ Fetch all posts
- ✅ Fetch posts by ID
- ✅ Filter posts by user ID
- ✅ Create posts (POST)
- ✅ Update posts (PUT)
- ✅ Delete posts (DELETE)
- ✅ Verify CRUD response codes
- ✅ Data integrity checks

**Tests**: 13 | **Assertions**: 25+

### Comments API Tests
- ✅ Fetch all comments
- ✅ Filter comments by post ID
- ✅ Validate email formats
- ✅ Verify data consistency
- ✅ Check for empty values
- ✅ Unique ID validation

**Tests**: 8 | **Assertions**: 18+

## Project Structure

```
.
├── src/
│   ├── api-client.js           # Reusable API client wrapper
│   └── test-helpers.js         # Validation helpers & test data generators
├── tests/
│   ├── setup.js                # Jest configuration & setup
│   └── api/
│       ├── users.spec.js       # User endpoint tests
│       ├── posts.spec.js       # Post endpoint tests
│       └── comments.spec.js    # Comment endpoint tests
├── jest.config.js              # Jest configuration
├── package.json                # Dependencies & scripts
└── README.md                   # This file
```

## Test Architecture

### API Client Pattern

The `APIClient` class provides a clean abstraction layer:

```javascript
const apiClient = new APIClient();
const response = await apiClient.getUserById(1);
```

This approach:
- Centralizes endpoint definitions
- Enables easy authentication injection
- Simplifies test maintenance
- Supports multiple API versions

### Test Helpers

Validation helpers enforce consistent assertions:

```javascript
const { expectValidUser } = require('../../src/test-helpers');

expectValidUser(userObject); // Validates all required properties
```

### Test Data Generation

Consistent, realistic test data:

```javascript
const { testDataGenerator } = require('../../src/test-helpers');

const newPost = testDataGenerator.generatePost(userId);
```

## Running the Tests

```bash
$ npm test

> api-testing-suite@1.0.0 test
> jest

 PASS  tests/api/users.spec.js
 PASS  tests/api/posts.spec.js
 PASS  tests/api/comments.spec.js

Test Suites: 3 passed, 3 total
Tests:       28 passed, 28 total
```

## CI/CD Integration

Tests run automatically on:
- ✅ Push to main/develop branches
- ✅ Pull requests
- ✅ Scheduled daily runs

View the workflow: [`.github/workflows/test.yml`](.github/workflows/test.yml)

## Code Coverage

Target coverage thresholds (enforced by Jest):
- **Lines**: 70%+
- **Branches**: 70%+
- **Functions**: 70%+
- **Statements**: 70%+

Generate coverage report:
```bash
npm run test:coverage
```

## Key QA Concepts Demonstrated

1. **API Contract Testing**: Validates response structure, not just status codes
2. **Data Validation**: Custom assertion helpers for consistent checks
3. **Negative Testing**: Tests for error cases (404, invalid data)
4. **Consistency Testing**: Verifies data integrity across requests
5. **CRUD Operations**: Full test coverage of Create, Read, Update, Delete
6. **Test Isolation**: Each test is independent and repeatable

## Extending the Tests

### Add New Endpoint Tests

```javascript
describe('New Endpoint', () => {
  it('should test something', async () => {
    const response = await apiClient.newMethod();
    expect(response.status).toBe(200);
  });
});
```

### Add New Validation Helpers

```javascript
// In src/test-helpers.js
function expectValidNewEntity(entity) {
  expect(entity).toHaveProperty('requiredField');
  // ... more validations
}
```

## Best Practices Applied

✅ Separation of concerns (API client, helpers, tests)
✅ DRY principle (reusable helpers and data generators)
✅ Meaningful test descriptions
✅ Comprehensive error handling
✅ Consistent code style
✅ Clear assertion messages
✅ Fast, isolated test execution

## License

MIT

## Author

Mario Rodríguez - QA Automation Engineer
