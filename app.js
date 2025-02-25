// bloglist-app/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const blogRoutes = require('./routes/blogRoutes');
const usersRouter = require('./routes/users');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/blogs', blogRoutes);
app.use('/api/users', usersRouter);

module.exports = app;
