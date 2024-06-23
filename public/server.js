// server.js

const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// PostgreSQL connection pool setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files (e.g., HTML, CSS, JS)
app.use(express.static('public'));

// Route to handle adding a user
app.post('/add-user', async (req, res) => {
  const { firstname, lastname, email, phone } = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO users (firstname, lastname, email, phone) VALUES ($1, $2, $3, $4) RETURNING id',
      [firstname, lastname, email, phone]
    );
    const insertedUserId = result.rows[0].id;
    client.release();
    res.status(201).json({ success: true, userId: insertedUserId });
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ success: false, error: 'An error occurred' });
  }
});

// Route to handle adding a company
app.post('/add-company', async (req, res) => {
  const { companyname, location } = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO companies (companyname, location) VALUES ($1, $2) RETURNING id',
      [companyname, location]
    );
    const insertedCompanyId = result.rows[0].id;
    client.release();
    res.status(201).json({ success: true, companyId: insertedCompanyId });
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ success: false, error: 'An error occurred' });
  }
});

// Route to handle adding a category
app.post('/add-category', async (req, res) => {
  const { categoryname, description } = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query(
      'INSERT INTO categories (categoryname, description) VALUES ($1, $2) RETURNING id',
      [categoryname, description]
    );
    const insertedCategoryId = result.rows[0].id;
    client.release();
    res.status(201).json({ success: true, categoryId: insertedCategoryId });
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ success: false, error: 'An error occurred' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
