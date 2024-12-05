const express = require('express');
const cors = require('cors');
const db = require('./config/dbConfig');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// **API Routes**

//Add a new user

app.post('/api/users', (req, res) => {
  const { username, email, password } = req.body;
  const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
  db.query(sql, [username, email, password], (err, results) => {
    if (err) {
      console.error('Error inserting user:', err);
      res.status(500).json({ message: 'Error adding user' });
    } else {
      res.status(201).json({ message: 'User added', userId: results.insertId });
    }
  });
});




// Fetch all tasks with user ID

// Add a new task

// Delete a task

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
