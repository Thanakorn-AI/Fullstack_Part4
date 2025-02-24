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

  test('blog posts have id property instead of _id', async () => {
    // Insert a sample blog
    const newBlog = new Blog({
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://test.com',
      likes: 3,
    });
    await newBlog.save();

    // Fetch blogs from the API
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    // Get the first blog from the response
    const blog = response.body[0];

    // Verify that 'id' exists and '_id' does not
    expect(blog.id).toBeDefined();
    expect(blog._id).toBeUndefined();
  });
});

describe('POST /api/blogs', () => {
  test('successfully creates a new blog post', async () => {
    // Initial count of blogs
    const initialBlogs = await Blog.find({});
    const initialCount = initialBlogs.length;

    // New blog data
    const newBlog = {
      title: 'New Test Blog',
      author: 'Test Author',
      url: 'http://testblog.com',
      likes: 7
    };

    // Send POST request
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    // Check the total number of blogs increased by one
    const blogsAfter = await Blog.find({});
    expect(blogsAfter.length).toBe(initialCount + 1);

    // Verify the content of the returned blog
    const returnedBlog = response.body;
    expect(returnedBlog.title).toBe(newBlog.title);
    expect(returnedBlog.author).toBe(newBlog.author);
    expect(returnedBlog.url).toBe(newBlog.url);
    expect(returnedBlog.likes).toBe(newBlog.likes);
    expect(returnedBlog.id).toBeDefined(); // From previous task's id transformation
  });

  test('missing likes property defaults to 0', async () => {
    // New blog data without likes
    const newBlog = {
      title: 'Blog Without Likes',
      author: 'No Likes Author',
      url: 'http://nolikes.com'
    };

    // Send POST request
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    // Verify likes is 0 in the response
    const returnedBlog = response.body;
    expect(returnedBlog.likes).toBe(0);
  });

  test('returns 400 if title is missing', async () => {
    const newBlog = {
      author: 'No Title Author',
      url: 'http://notitle.com',
      likes: 5
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400);
  });

  test('returns 400 if url is missing', async () => {
    const newBlog = {
      title: 'No URL Blog',
      author: 'No URL Author',
      likes: 3
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400);
  });
});

describe('DELETE /api/blogs/:id', () => {
  test('successfully deletes an existing blog', async () => {
    // Create a blog to delete
    const blogToDelete = new Blog({
      title: 'Blog to Delete',
      author: 'Delete Author',
      url: 'http://delete.com',
      likes: 2
    });
    const savedBlog = await blogToDelete.save();

    // Initial count of blogs
    const initialBlogs = await Blog.find({});
    const initialCount = initialBlogs.length;

    // Send DELETE request
    await api
      .delete(`/api/blogs/${savedBlog.id}`)
      .expect(204);

    // Verify the blog was removed
    const blogsAfter = await Blog.find({});
    expect(blogsAfter.length).toBe(initialCount - 1);

    // Verify the specific blog is gone
    const blogIds = blogsAfter.map(blog => blog.id);
    expect(blogIds).not.toContain(savedBlog.id);
  });

  test('returns 404 if blog does not exist', async () => {
    // Use a random, non-existent ID
    const nonExistentId = '507f1f77bcf86cd799439011'; // Example valid ObjectId format

    await api
      .delete(`/api/blogs/${nonExistentId}`)
      .expect(404);
  });
});
