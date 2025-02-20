// bloglist-app/index.js
const app = require('./app');
const mongoose = require('mongoose');

const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost/bloglist';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.log('Error connecting to MongoDB:', error.message));

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
