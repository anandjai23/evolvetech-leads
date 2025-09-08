const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const requestIp = require("request-ip"); // to get client IP
const app = express();

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(requestIp.mw());

const LEAD_TOKEN = "c51dacbf90cd4f1db448b0fe861b6cf4"; // your lead token
const TRAFFIC_SOURCE_ID = "1051"; // your traffic source

function todayDate() {
  return new Date().toISOString().split("T")[0];
}

app.post("/submit", async (req, res) => {
  try {
    const form = req.body;
    const jornayaLeadId = uuidv4(); // fake Jornaya for now
    const clientIp = req.clientIp || "127.0.0.1"; // capture IP

    // TrustedForm fake link (replace with real script capture)
    const trustedFormUrl = `https://trustedform.com/${uuidv4()}`;

    const payload = {
      caller_id: form.number, // must be +1XXXXXXXXXX
      full_name: `${form.first_name} ${form.last_name}`,
      data: {
        traffic_source_id: TRAFFIC_SOURCE_ID,

        // Personal Info
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        address: form.address,
        city: form.city,
        state: form.state,
        zip: form.zip,
        dob: form.dob,
        marital_status: form.marital_status,
        gender: form.gender,
        residence_status: form.residence_status,
        ip_address: clientIp,

        // Vehicle Info
        vehicle1_year: form.vehicle1_year,
        vehicle1_make: form.vehicle1_make,
        vehicle1_model: form.vehicle1_model,

        // Driving / Insurance Info
        driver1_credit_rating: form.driver1_credit_rating,
        driver1_sr22_required: form.driver1_sr22_required,
        sr22: form.sr22,
        incident_type: form.incident_type,
        drivers: form.drivers || 1,
        insurance: form.insurance || "yes",

        // Compliance
        jornaya_leadid: jornayaLeadId,
        xxTrustedFormCertUrl: trustedFormUrl,
        policy_start_date: form.policy_start_date || todayDate()
      }
    };

    const url = `https://evolvetech-innovations.trackdrive.com/api/v1/leads?lead_token=${LEAD_TOKEN}`;
    const response = await axios.post(url, payload, {
      headers: { "Content-Type": "application/json" }
    });

    res.json({ status: "success", api_response: response.data });
  } catch (err) {
    console.error("API Error:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      status: "error",
      details: err.response?.data || err.message
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
