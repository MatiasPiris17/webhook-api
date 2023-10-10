const { Router } = require("express")
const controllers = require("../controllers")
const middlewares = require("../middlewares")
const router = Router()

router.get("/", controllers.authorization)

router.post("/", middlewares.webhookValidation, controllers.webhook)
// router.post("/", controllers.webhook)

module.exports = router