const { catchedAsync } = require("../utils"); 

module.exports = {
    webhook: catchedAsync(require("./webhook")),
    authorization: catchedAsync(require("./authorization"))
}