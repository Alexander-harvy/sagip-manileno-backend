const express = require("express");
const router = express.Router();
const responderController = require("../controllers/responderController");

router.post("/responders", responderController.createResponder);
router.get("/responders", responderController.getAllResponders);

module.exports = router;