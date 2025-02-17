// bloglist-app/index.js
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
});

const Blog = mongoose.model('Blog', blogSchema);

const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost/bloglist';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.log('Error connecting to MongoDB:', error.message));

app.use(cors());
app.use(express.json());

app.get('/api/blogs', (request, response) => {
  Blog.find({})
    .then(blogs => {
      response.json(blogs);
    })
    .catch(error => response.status(500).json({ error: 'Error fetching blogs' }));
});

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body);

  blog.save()
    .then(result => {
      response.status(201).json(result);
    })
    .catch(error => response.status(400).json({ error: 'Error saving the blog' }));
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
