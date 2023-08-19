const port = process.env.PORT || 3002;
const express = require("express");
const body_parser = require("body-parser");
const { Guardian, Message, Purchases } = require("../db");

app = express().use(body_parser.json());

app.listen(port, () => console.log("webhook is listening"));

app.post("/webhook", async (req, res) => {
  try {
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
      const messageGuardian =
        body.entry[0]?.changes[0]?.value?.messages[0]?.button?.text;

      if (messageGuardian === "Si") {
        const idMessage = body.entry[0].changes[0].value.messages[0].context.id;

        const message = await Message.findOne({
          where: {
            name: idMessage,
          },
          // include: [
          //   {
          //     model: Guardian,
          //     attributes: ["id_guardian"],
          //   },
          //   {
          //     model: Purchases,
          //     attributes: ["id_package"],
          //   },
          // ],
        });

        const id_guardian = message.Guardian.id_guardian;
        const id_package = message.Purchases.id_package;

        const purchaseIdGuardian = message.Purchases.id_guardian;

        if (purchaseIdGuardian === null) {
          const purchaseToUpdate = await Purchases.findOne({
            where: {
              id_package: id_package,
            },
          });
          await purchaseToUpdate.update({
            id_guardian: id_guardian,
          });
        }

        //Manejar la variable cuando purchaseIdGuardian != null
        if (purchaseIdGuardian != null) {
          // Busco en la base de datos "purchases" si tiene un guardian asignado
          //Si hay un guardian asignado, se realiza una peticion post enviando el template de la historia "Mensaje Whatsapp Otros Guardianes 3"
          //Si no hay un guardian asignado, se realiza una peticion post enviando el template de la historia "Mensaje Whatsapp Recepción 1"
        }

        //Por ultimo, se envia un mensaje al usuario avisando que guardian va a recibir su compra, utilizando el template de la historia "Mensaje Whatsapp Usuario 2"

        return res.status(200);
      }

      if (messageGuardian === "No") {
        return res
          .status(200)
          .send(`El guardian ${nameGuardian} NO recibira la compra`);
      }
    } else {
      return res
        .status(200)
        .send("Mensaje distinto de la relacion con: confirmGuardian");
    }

    res.status(200).send("Mensaje procesado");
  } catch (error) {
    console.log("Error ", error);
    res.status(404).json("Error" + error.message);
  }
});

app.get("/webhook", async (req, res) => {
  try {
    const verify_token = process.env.VERIFY_TOKEN;
    console.log(challenge);

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
