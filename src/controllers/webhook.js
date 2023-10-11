const { response } = require("../utils");

module.exports = (req, res) => {
  console.log(JSON.stringify(req.body, null, 2));
  response(res, 200, { message: "Webhook funcionando" });
  // res.status(200).json({ message:"Webhook funcionando" })

};
