const token = process.env.WHATSAPP_TOKEN;
const port =process.env.PORT || 3001
const express = require("express")
const body_parser = require("body-parser")
const axios = require("axios")

app = express().use(body_parser.json());

app.listen(port, () => console.log("webhook is listening"));

app.post("/webhook", async (req, res) => {
  try {
    let from = req.body.entry[0].changes[0].value.messages[0].from;
    let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body;

    const url = `https://graph.facebook.com/v17.0/108588405630526/messages?access_token=${token}`;
    const config = { "Content-Type": "application/json" };
    const data = {
      messaging_product: "whatsapp",
      to: from,
      text: { body: "Ack: " + msg_body },
    };

    console.log(JSON.stringify(req.body, null, 2));

    await axios.post(url, data, config);

    return res.status(200);
  } catch (error) {
    // console.log(error.response);
    res.status(404).json("Error" + {error: error.response});
  }
});

app.get("/webhook", async (req, res) => {
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
        return res.status(404).json(error);
      }
    }
    res.status(200).send("webhook");
  } catch (error) {
    console.log(error);
    res.status(404).json(error);
  }
});
