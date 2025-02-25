// routes/blogRoutes.js
const express = require('express');
const Blog = require('../models/blog');
const User = require('../models/user');

const router = express.Router();

router.get('/', async (request, response) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 });
    response.json(blogs);
  } catch (error) {
    response.status(500).json({ error: 'Error fetching blogs' });
  }
});

router.post('/', async (request, response) => {
  try {
    const { title, author, url, likes } = request.body;

    // Find the first user in the database
    const user = await User.findOne({});
    if (!user) {
      return response.status(400).json({ error: 'No users exist in the database' });
    }

    const blog = new Blog({
      title,
      author,
      url,
      likes: likes !== undefined ? likes : 0,
      user: user._id
    });

    const savedBlog = await blog.save();

    // Add blog to user's blogs array
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog);
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

// New PUT route (Update likes)
router.put('/:id', async (request, response) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      { likes: request.body.likes }, // Focus on updating likes
      { new: true, runValidators: true }
    );
    if (!updatedBlog) {
      return response.status(404).json({ error: 'Blog not found' });
    }
    response.json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    response.status(400).json({ error: 'Error updating the blog' });
  }
});

module.exports = router;
