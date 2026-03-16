const express = require("express");
const router = express.Router();
const responderController = require("../controllers/responderController");

router.post("/", responderController.createResponder);
router.get("/", responderController.getAllResponders);
router.get("/:id/Responders", responderController.getResponderById);

module.exports = router;