const { response } = require("../utils");

module.exports = (req, res) => {
  console.log(req.body)
  response(res, 200, { message: "Webhook funcionando" });
  // res.status(200).json({ message:"Webhook funcionando" })

};
