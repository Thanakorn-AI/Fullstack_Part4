// utils/list_helper.js
const dummy = (blogs) => {
    return 1;
  };
  
const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};


const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }
  const maxLikes = Math.max(...blogs.map(blog => blog.likes));
  const favorite = blogs.find(blog => blog.likes === maxLikes);
  return { title: favorite.title, author: favorite.author, likes: favorite.likes };
};

const mostBlogs = (blogs) => {
  const authors = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + 1;
    return acc;
  }, {});

  const maxBlogs = Math.max(...Object.values(authors));
  const author = Object.keys(authors).find(key => authors[key] === maxBlogs);
  
  return { author, blogs: maxBlogs };
};


  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
  };
