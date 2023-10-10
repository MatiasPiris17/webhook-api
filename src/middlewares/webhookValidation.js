const { ClientError } = require("../utils/errors");

module.exports = (req, res, next) => {
  const { body } = req;
  if (body) return next();

  else throw new ClientError("Datos invalidos", 400);
};

