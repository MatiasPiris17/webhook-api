const port = process.env.PORT || 3002;
const axios = require("axios");
const express = require("express");
const body_parser = require("body-parser");

app = express().use(body_parser.json());
app.listen(port, () => console.log(`webhook is listening: ${port}`));



app.post("/webhook", async (req, res) => {

  // const url = "https://graph.facebook.com/v17.0/108588405630526/messages"

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
      const phoneGuardian = body.entry[0].changes[0].value.messages[0].from;

      // const phone = await validationPhone(phoneGuardian);

      if (messageGuardian === "Si") {
        const idMessage = body.entry[0].changes[0].value.messages[0].context.id;

        const message = {
          id_message: idMessage,
          phone_user: phoneGuardian,
          name_user: nameGuardian,
          response_user: messageGuardian,
        }
        console.log(message)

        // const message = await Message.findOne({
        //   where: {
        //     name: idMessage,
        //   },
        // });

        // const purchase = await Purchases.findOne({
        //   where: {
        //     id_package: message.PurchaseIdPackage,
        //   },
        // });

        // const guardian = await Guardian.findOne({
        //   where: {
        //     id_guardian: message.GuardianIdGuardian,
        //   },
        // });

        // const id_guardian = guardian.id_guardian;
        // const nameGuardian = guardian.name_guardian;

        // const id_package = purchase.id_package;
        // const purchaseIdGuardian = purchase.GuardianIdGuardian;
        // const purchaseCode = purchase.code;

        // const id_user = purchase.UserIdUser;

        // const userDate = await User.findOne({
        //   where: {
        //     id_user: id_user,
        //   },
        // });

        // const user_name = userDate.name_lastname;

        // if (purchaseIdGuardian === null) {
        //   const purchaseToUpdate = await Purchases.findOne({
        //     where: {
        //       id_package: id_package,
        //     },
        //   });
        //   await purchaseToUpdate.update({
        //     GuardianIdGuardian: id_guardian,
        //   });

          // const dataPurchase = await templatePurchase(phone, user_name);

          // const dataPurchaseCode = await templatePurchaseCode(
          //   phone,
          //   user_name,
          //   purchaseCode
          // );

          // if (purchaseCode !== null) {
          //   await axios.post(url, dataPurchaseCode, config);
          // } else {
          //   await axios.post(url, dataPurchase, config);
          // }

        //   if (userDate) {
        //     const country_code = userDate.country_code;
        //     const user_phone = userDate.user_phone;
        //     const combinedPhoneNumber = `${country_code}${user_phone}`;
        //     const phoneUser = await validationPhone(combinedPhoneNumber);

        //     const dataCoordinacionUser = await templateCoordinacionUser(
        //       phoneUser,
        //       nameGuardian
        //     );

        //     await axios.post(url, dataCoordinacionUser, config);
        //   } else {
        //     console.log("Error en la coordinacion con el usuario");
        //   }
        // }

        // if (purchaseIdGuardian !== null) {
        //   const phoneOtherGuardians = phone;
        //   const dataOtherGuardians = await templateOtherGuardians(
        //     phoneOtherGuardians
        //   );

        //   await axios.post(url, dataOtherGuardians, config);
        // } else {
        //   console.log(purchaseIdGuardian);
        // }

        return res.status(200).send("Guardianes y usuario informados");
      }

      if (messageGuardian === "No") {
        const message = {
          name_user: nameGuardian,
          response_user: messageGuardian
        }
        console.log(message)
        return res
          .status(200)
          .send(`El guardian ${nameGuardian} NO recibira la compra`);
      }
    } else {
      return res.status(200)
    }

    res.status(200).send("Mensaje procesado");

  } catch (error) {
    console.log("Error ", error);
    res.status(400).json("Error =>" + {error: error.message});
  }
});



app.get("/webhook", async (req, res) => {
  try {
    const verify_token = "Timbring";
    
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    if (mode && token) {
      if (mode === "subscribe" && token === verify_token) {
        console.log("WEBHOOK_VERIFIED");
        res.status(200).send(challenge);
      } 
    }
    console.log("Conectado pero no verificado");
    res.status(200).send("Conectado pero no verificado");
  } catch (error) {
    console.log(error);
    res.status(404).json({error: error.message});
  }
});
