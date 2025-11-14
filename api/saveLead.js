const { Client } = require("pg");

async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { name, email, phone, business } = req.body;

  if (!name || !email || !phone || !business) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const client = new Client({
    connectionString:
      "postgresql://neondb_owner:npg_yfVJT48LGBOM@ep-muddy-bird-a44rcp30-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  });

  try {
    await client.connect();

    const query = `
      INSERT INTO demo_lead_table 
      (lead_name, lead_email, lead_phone_number, lead_business_name, lead_call_status)
      VALUES ($1, $2, $3, $4, false)
    `;

    await client.query(query, [name, email, phone, business]);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("DB Error:", error);
    res.status(500).json({ error: "Database insert failed." });
  } finally {
    await client.end();
  }
}

module.exports = handler;
