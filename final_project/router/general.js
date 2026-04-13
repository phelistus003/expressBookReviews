const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {

    const username = req.body.username;
  const password = req.body.password;

  if(!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }

  if(isValid(username)) {
    return res.status(400).json({message: "Username already exists"});
  }

  users.push({username, password});
  return res.status(200).json({message: "User registered successfully"});
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books, null, 4));
  //Write your code here
 // return res.status(300).json({message: "Yet to be implemented"});
});

public_users.get('/async-books', async function (req, res) {
    try {
      const response = await axios.get('http://localhost:5000/');
      res.send(JSON.stringify(response.data, null, 4));
    } catch (error) {
      res.status(500).json({message: "Error fetching books", error: error.message});
    }
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

    const isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn], null, 4));
});
// Get book by ISBN using async-await with Axios
public_users.get('/async-isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    res.status(500).json({message: "Error fetching book", error: error.message});
  }

  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
  const bookKeys = Object.keys(books);
  const booksByAuthor = {};
  
  bookKeys.forEach(key => {
    if(books[key].author === author) {
      booksByAuthor[key] = books[key];
    }
  });
  public_users.get('/async-author/:author', async function (req, res) {
    try {
      const author = req.params.author;
      const response = await axios.get(`http://localhost:5000/author/${author}`);
      res.send(JSON.stringify(response.data, null, 4));
    } catch (error) {
      res.status(500).json({message: "Error fetching books by author", error: error.message});
    }
  });

  res.send(JSON.stringify(booksByAuthor, null, 4));
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
  const bookKeys = Object.keys(books);
  const booksByTitle = {};

  bookKeys.forEach(key => {
    if(books[key].title === title) {
      booksByTitle[key] = books[key];
    }
  });

  // Get books by Title using async-await with Axios
public_users.get('/async-title/:title', async function (req, res) {
    try {
      const title = req.params.title;
      const response = await axios.get(`http://localhost:5000/title/${title}`);
      res.send(JSON.stringify(response.data, null, 4));
    } catch (error) {
      res.status(500).json({message: "Error fetching books by title", error: error.message});
    }
  });

  res.send(JSON.stringify(booksByTitle, null, 4));
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn].reviews, null, 4));
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
