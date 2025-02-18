// bloglist-app/index.js
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  url: { type: String, required: true },
  likes: { type: Number, default: 0 }
});

const Blog = mongoose.model('Blog', blogSchema, 'Bloglist-app');

const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost/bloglist';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.log('Error connecting to MongoDB:', error.message));

app.use(cors());
app.use(express.json());

app.get('/api/blogs', async (request, response) => {
  try {
    const blogs = await Blog.find({});
    response.json(blogs);
  } catch (error) {
    response.status(500).json({ error: 'Error fetching blogs' });
  }
});

app.post('/api/blogs', async (request, response) => {
  console.log('Request body:', request.body);  // Add this line to debug
  try {
    const blog = new Blog(request.body);
    const result = await blog.save();
    response.status(201).json(result);
  } catch (error) {
    console.error('Error saving blog:', error);  // Log error details
    response.status(400).json({ error: 'Error saving the blog' });
  }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
