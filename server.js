const token = process.env.WHATSAPP_TOKEN;

const request = require("request"),
  express = require("express"),
  body_parser = require("body-parser"),
  axios = require("axios");
app = express().use(body_parser.json());

app.listen(3001, () => console.log("webhook is listening"));

app.post("/webhook", (req, res) => {
  try {
    console.log(JSON.stringify(req.body, null, 2));

    if (req.body.object) {
      if (
        req.body.entry &&
        req.body.entry[0].changes &&
        req.body.entry[0].changes[0] &&
        req.body.entry[0].changes[0].value.messages &&
        req.body.entry[0].changes[0].value.messages[0]
      ) {
        let from = req.body.entry[0].changes[0].value.messages[0].from;
        let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body;
        axios({
          method: "POST",
          url:
            "https://graph.facebook.com/v17.0/108588405630526/messages" +
            "?access_token=" +
            token,
          data: {
            messaging_product: "whatsapp",
            to: from,
            text: { body: "Ack: " + msg_body },
          },
          headers: { "Content-Type": "application/json" },
        });
      }
      res.sendStatus(200);
    } else {
      return res.status(404).json(error)
    }
  } catch (error) {
    console.log(error);
    res.status(404).json(error);
  }
});

// Accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
app.get("/webhook", (req, res) => {
  try {
    const verify_token = process.env.VERIFY_TOKEN;
  
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];
  
    if (mode && token) {
      if (mode === "subscribe" && token === verify_token) {
        console.log("WEBHOOK_VERIFIED");
        res.status(200).send(challenge);
      } else {
        return res.status(404).json(error)
      }
    }
  } catch (error) {
    console.log(error);
    res.status(404).json(error);
  }
});
