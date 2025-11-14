const { Pool } = require('pg');

// Use connection pooling for serverless
let pool;

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_yfVJT48LGBOM@ep-muddy-bird-a44rcp30-pooler.us-east-1.aws.neon.tech/voice_agents?sslmode=require&channel_binding=require',
      ssl: {
        rejectUnauthorized: false
      },
      max: 1, // Limit connections for serverless
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }
  return pool;
}

async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method Not Allowed. Please use POST.'
    });
  }

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

    const dbPool = getPool();
    const result = await dbPool.query(query, values);

    return res.status(200).json({
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
      hint: error.hint
    });
    
    return res.status(500).json({
      success: false,
      message: 'An error occurred while submitting your information. Please try again.',
      error: error.message,
      detail: error.detail || null
    });
  }
}

module.exports = handler;

