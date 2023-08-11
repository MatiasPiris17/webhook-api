// const token = process.env.WHATSAPP_TOKEN;
const port = process.env.PORT || 3002;
const express = require("express");
const body_parser = require("body-parser");
// const axios = require("axios");
const { validationPhone } = require("./controllador");
// const { Guardian } = require("../timbring-backend/src/db");

app = express().use(body_parser.json());

app.listen(port, () => console.log("webhook is listening"));

app.post("/webhook", async (req, res) => {
  try {

    console.log(JSON.stringify(req.body, null, 2));

    const body = req.body;

    if (
      body.entry &&
      Array.isArray(body.entry) &&
      body.entry.length > 0 &&
      body.entry[0]?.changes &&
      Array.isArray(body.entry[0].changes) &&
      body.entry[0].changes.length > 0 &&
      body.entry[0].changes[0]?.value &&
      body.entry[0].changes[0].value.contacts &&
      Array.isArray(body.entry[0].changes[0].value.contacts) &&
      body.entry[0].changes[0].value.contacts.length > 0
    ) {
      const nameGuardian =
        body.entry[0]?.changes[0]?.value?.contacts[0]?.profile?.name;
      const phoneGuardian = body.entry[0]?.changes[0]?.value?.messages[0]?.from;
      const messageGuardian =
        body.entry[0]?.changes[0]?.value?.messages[0]?.button?.text;

      const phone = await validationPhone(phoneGuardian);

      if (messageGuardian === "Si") {
        console.log(`El guardian ${nameGuardian} va a recibir el paquete: ${phone}`);
        const phoneWithoutCountryCode = phone.slice(3) //Solamente para Argentina
        //Buscar en la tabla de "guardianes" que guardian coincide con (phoneWithoutCountryCode)

        //El guardian que coincide le extraigo el id_guardian

        //Busco el id_packege y busco en la tabla "compras"
 
        //Buscar en la tabla de "compras" si ya hay un guardian asignado para recibir la compra

        //Si hay un guardian asignado, se realiza una peticion post enviando el template de la historia "Mensaje Whatsapp Otros Guardianes 3"

        //Si no hay un guardian asignado, se realiza una peticion post enviando el template de la historia "Mensaje Whatsapp Recepción 1"

        //Por ultimo, se envia un mensaje al usuario avisando que guardian va a recibir su compra, utilizando el template de la historia "Mensaje Whatsapp Usuario 2"


        return res.status(200).send("Mensaje procesado");
      }
      if(messageGuardian === "No"){
        console.log(`El guardian ${nameGuardian} NO va a recibir el paquete:`);
        return res.status(200).send("Mensaje procesado")
      }
    } else {
      console.log(`Mensaje omitido`);
      return res.status(200).send("Mensaje omitido");
    }

    res.status(200).send("Mensaje procesado");
  } catch (error) {
    console.log("Error ", error);
    res.status(404).json("Error" + error.message);
  }
});

// let phone_number_id =
//   req.body.entry[0].changes[0].value.metadata.phone_number_id;

// const data = {
//   messaging_product: "whatsapp",
//   to: phone,
//   text: { body: "Ack: " + mensaje },
// };

// const config = { "Content-Type": "application/json" };

// await axios.post(
//   "https://graph.facebook.com/v17.0/" +
//     phone_number_id +
//     "/messages?access_token=" +
//     token,
//   data,
//   config
// );

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
    res.status(200).send("WEBHOOK_VERIFIED");
  } catch (error) {
    console.log(error);
    res.status(404).json(error);
  }
});
