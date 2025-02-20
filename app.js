// bloglist-app/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const blogRoutes = require('./routes/blogRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/blogs', blogRoutes);

module.exports = app;
