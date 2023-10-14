const { response } = require("../utils");

module.exports = (req, res) => {
  // console.log(JSON.stringify(req.body, null, 2));

  const data = {
    message_text: req.body.entry[0]?.changes[0]?.value?.messages[0]?.button?.text,
    phoneGuardian: req.body.entry[0].changes[0].value.messages[0].from,
    id_message: req.body.entry[0].changes[0].value.messages[0].context.id,
  }
  console.log(data)

  response(res, 200, { message: "Webhook funcionando" });
  // res.status(200).json({ message:"Webhook funcionando" })

};
