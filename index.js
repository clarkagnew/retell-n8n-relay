const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// Put your n8n webhook URL in Render as an environment variable named N8N_WEBHOOK_URL
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

app.post("/webhook", async (req, res) => {
  const payload = req.body;
  try {
    await axios.post(N8N_WEBHOOK_URL, payload, {
      headers: { "Content-Type": "application/json" }
    });
    console.log("Sent to n8n:", payload);
  } catch (err) {
    console.error("Error sending to n8n:", err.message);
  }
  res.status(204).send();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});