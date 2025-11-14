const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test database connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Serve the form page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle form submission
app.post('/api/submit-lead', async (req, res) => {
  try {
    const { name, email, phone, businessName } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !businessName) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required. Please fill in name, email, phone number, and business name.'
      });
    }

    // Validate and format phone number
    let formattedPhone = phone.trim();
    
    // Ensure phone number starts with +
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+' + formattedPhone.replace(/^\+/, '');
    }
    
    // Remove any spaces, dashes, or other non-digit characters except +
    formattedPhone = formattedPhone.replace(/[^\d+]/g, '');
    
    // Basic validation: should have country code (1-4 digits) and number (at least 7 digits)
    const phoneRegex = /^\+[1-9]\d{1,3}\d{7,14}$/;
    if (!phoneRegex.test(formattedPhone)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid phone number with country code.'
      });
    }

    // Insert into database
    const query = `
      INSERT INTO demo_lead_table 
      (lead_name, lead_email, lead_phone_number, lead_business_name, lead_call_status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const values = [name.trim(), email.trim().toLowerCase(), formattedPhone, businessName.trim(), false];

    const result = await pool.query(query, values);

    res.json({
      success: true,
      message: 'Lead submitted successfully!',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error submitting lead:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      detail: error.detail,
      hint: error.hint,
      stack: error.stack
    });
    res.status(500).json({
      success: false,
      message: 'An error occurred while submitting your information. Please try again.',
      error: error.message,
      detail: error.detail || null
    });
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});

// Test database connection on startup
async function testConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Database connection successful!', result.rows[0]);
  } catch (error) {
    console.error('Database connection failed:', error.message);
    console.error('Please check your DATABASE_URL in .env file');
  }
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  testConnection();
});
