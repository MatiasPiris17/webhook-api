const express = require("express");
const morgan = require("morgan");

const server = express();

server.use(morgan("dev"));
server.use(express.json());


server.use("/webhook", require("./routes"));

server.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).send({
    error: true,
    message: err.message,
  });
});

// server.use((err, req, res, next) => {
//   const status = err.status || 500;
//   const message = err.message || err;
//   console.error(err);
//   res.status(status).send(message);
// });

module.exports = server;
