// tests/blog_api.test.js
const supertest = require('supertest');
const app = require('../app'); 
const api = supertest(app);

describe('GET /api/blogs', () => {
  test('blogs are returned as JSON', async () => {
    await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
});
