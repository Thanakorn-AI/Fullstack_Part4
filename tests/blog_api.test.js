// tests/blog_api.test.js
const supertest = require('supertest');
const app = require('../app'); 
const api = supertest(app);
const mongoose = require('mongoose');
const Blog = require('../models/blog');

jest.setTimeout(30000);

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_MONGODB_URI);
});

beforeEach(async () => {
  await Blog.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});


describe('GET /api/blogs', () => {
  test('blogs are returned as JSON and correct number of blogs', async () => {
    // Insert sample blogs into the test database
    const blog1 = new Blog({
      title: 'Blog 1',
      author: 'Author 1',
      url: 'http://example.com/1',
      likes: 5,
    });
    const blog2 = new Blog({
      title: 'Blog 2',
      author: 'Author 2',
      url: 'http://example.com/2',
      likes: 10,
    });
    await blog1.save();
    await blog2.save();

    // Make the GET request
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    // Verify the number of blogs
    const blogs = response.body;
    expect(blogs.length).toBe(2); // Assuming 2 blogs are inserted
  });
});
