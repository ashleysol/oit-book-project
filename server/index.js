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

// Fetch all tasks with user ID

// Add a new task

// Delete a task

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
