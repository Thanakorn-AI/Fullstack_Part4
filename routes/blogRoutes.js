// routes/blogRoutes.js
const express = require('express');
const Blog = require('../models/blog');

const router = express.Router();

router.get('/', async (request, response) => {
  try {
    const blogs = await Blog.find({});
    response.json(blogs);
  } catch (error) {
    response.status(500).json({ error: 'Error fetching blogs' });
  }
});

router.post('/', async (request, response) => {
  try {
    const blog = new Blog(request.body);
    const result = await blog.save();
    response.status(201).json(result);
  } catch (error) {
    console.error('Error saving blog:', error);
    response.status(400).json({ error: 'Error saving the blog' });
  }
});

// New DELETE route
router.delete('/:id', async (request, response) => {
  try {
    const blog = await Blog.findByIdAndDelete(request.params.id);
    if (!blog) {
      return response.status(404).json({ error: 'Blog not found' });
    }
    response.status(204).end(); // No content on successful deletion
  } catch (error) {
    console.error('Error deleting blog:', error);
    response.status(500).json({ error: 'Error deleting the blog' });
  }
});

module.exports = router;
