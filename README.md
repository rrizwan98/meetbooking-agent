# Lead Form Website

A beautiful single-page lead form that saves user information to a PostgreSQL database.

## Features

- Modern, responsive design
- Form validation (all fields are mandatory)
- Saves data to PostgreSQL database
- Automatic default value for `lead_call_status` (false)

## Setup Instructions

### 1. Install Dependencies

First, make sure you have Node.js installed on your system. Then run:

```bash
npm install
```

### 2. Configure Database

Create a `.env` file in the root directory and add your database connection string:

```bash
# Copy the example file
copy .env.example .env
```

Then edit `.env` and add your database URL:
```
DATABASE_URL=postgresql://neondb_owner:npg_yfVJT48LGBOM@ep-muddy-bird-a44rcp30-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
PORT=3000
```

### 3. Run the Server

Start the server with:

```bash
npm start
```

Or for development:

```bash
node server.js
```

The server will start on `http://localhost:3000`

### 4. Access the Form

Open your web browser and navigate to:
```
http://localhost:3000
```

## How to Run (Urdu/Hindi)

1. **Pehle Node.js install karein** (agar nahi hai to)
2. **Terminal/Command Prompt kholen** aur project folder mein jayen
3. **Dependencies install karein:**
   ```
   npm install
   ```
4. **.env file banayen** aur database connection string add karein
5. **Server start karein:**
   ```
   npm start
   ```
6. **Browser mein kholen:** `http://localhost:3000`

## Form Fields

- **Name** (required)
- **Email** (required, must be valid email format)
- **Phone Number** (required)
- **Business Name** (required)

## API Endpoints

- `GET /` - Serves the form page
- `POST /api/submit-lead` - Submits lead data to database
- `GET /api/health` - Health check endpoint

## Database Schema

The form saves data to the `demo_lead_table` with the following columns:
- `lead_name`
- `lead_email`
- `lead_phone_number`
- `lead_business_name`
- `lead_call_status` (automatically set to `false`)

## Troubleshooting

- Make sure PostgreSQL database is accessible
- Check that `.env` file has correct DATABASE_URL
- Ensure all required fields are filled before submitting
- Check server console for error messages

