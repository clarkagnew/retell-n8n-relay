const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

app.post("/webhook", async (req, res) => {
  const payload = req.body;
  
  try {
    // Send to n8n and wait for response
    const n8nResponse = await axios.post(N8N_WEBHOOK_URL, payload, {
      headers: { "Content-Type": "application/json" }
    });
    
    console.log("Sent to n8n:", payload);
    console.log("n8n response:", n8nResponse.data);
    
    // Transform response for Retell if it's a call_inbound event
    let responseData = n8nResponse.data;
    
    if (payload.event === 'call_inbound') {
      // Extract contactId from n8n response
      let contactId = null;
      
      if (responseData.contacts && responseData.contacts[0]) {
        contactId = responseData.contacts[0].id; // Found contact
      } else if (responseData.contact) {
        contactId = responseData.contact.id; // Created contact
      }
      
      // Format for Retell
      responseData = {
        call_inbound: {
          dynamic_variables: {
            contactId: contactId
          }
        }
      };
    }
    
    console.log("Sending to Retell:", responseData);
    res.json(responseData);
    
  } catch (err) {
    console.error("Error with n8n:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});