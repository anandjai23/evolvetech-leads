const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Homepage route with a simple form
app.get("/", (req, res) => {
  res.send(`
    <h2>Evolvetech Lead Form</h2>
    <form action="/submit" method="post">
      <input type="text" name="first_name" placeholder="First Name" required /><br/>
      <input type="text" name="last_name" placeholder="Last Name" required /><br/>
      <input type="email" name="email" placeholder="Email" required /><br/>
      <input type="text" name="phone" placeholder="Phone" required /><br/>
      <button type="submit">Submit</button>
    </form>
  `);
});

// Submit route
app.post("/submit", async (req, res) => {
  try {
    const lead = {
      traffic_source_id: 1051,
      lead_token: "c51dacbf90cd4f1db448b0fe861b6cf4", // your token
      number: req.body.phone,
      email: req.body.email,
      full_name: `${req.body.first_name} ${req.body.last_name}`,
      data: {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        ip_address: req.ip,
        jornaya_leadid: uuidv4(), // unique id every time
        trusted_form_url: "https://cert.trustedform.com/XXXXXXXX" // replace with your TF URL
      }
    };

    const response = await axios.post(
      "https://evolvetech-innovations.trackdrive.com/api/v1/leads",
      lead
    );

    res.json({ status: "success", api_response: response.data });
  } catch (error) {
    res.json({
      status: "error",
      details: error.response ? error.response.data : error.message
    });
  }
});

// Railway/Heroku friendly port binding
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
