// bloglist-app/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const blogRoutes = require('./routes/blogRoutes');

const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost/bloglist';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.log('Error connecting to MongoDB:', error.message));

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/blogs', blogRoutes);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
