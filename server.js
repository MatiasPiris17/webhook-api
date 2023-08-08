const token = process.env.WHATSAPP_TOKEN;
const port =process.env.PORT || 3001
const express = require("express")
const body_parser = require("body-parser")
const axios = require("axios")
const {validationPhone} = require('./controllador')

app = express().use(body_parser.json());

app.listen(port, () => console.log("webhook is listening"));

app.post("/webhook", async (req, res) => {

  try {
    
    if (req.body.entry) {
      const response = {
        nombre: req.body.entry[0].changes[0].value.contacts[0].profile.name,
        numero: req.body.entry[0].changes[0].value.messages[0].from,
        mensaje: req.body.entry[0].changes[0].value.messages[0].button.text
      }    
        const {numero, nombre, mensaje} = response
        const phone = validationPhone(numero)

        let phone_number_id = req.body.entry[0].changes[0].value.metadata.phone_number_id;

        const data = {
          messaging_product: "whatsapp",
            to: phone,
            text: { body: "Ack: " + response.mensaje },
        } 
        const config = {  "Content-Type": "application/json"}

        await axios.post(
          "https://graph.facebook.com/v17.0/" + phone_number_id +"/messages?access_token=" + token,
          data, config)
        if (mensaje === "Si") {
          console.log(`El guardian ${nombre} va a recibir el paquete`)
          const phoneguardian = phone //aca se guarda el numero del guardian
          console.log(phoneguardian)
        }
      return res.status(200)
  }

    res.status(200)
  }
  catch (error) {
    console.log(error.response);
    res.status(404).json("Error" + {error: error.response});
  }
})

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
