const express = require("express");
const router = express.Router();
const responderController = require("../controllers/responderController");

const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

// PUBLIC
router.post("/login", responderController.loginResponder);

// ADMIN ONLY (create responder)
router.post("/", verifyToken, allowRoles("ERU_ADMIN"), responderController.createResponder);

// ADMIN + RESPONDER
router.get("/", verifyToken, allowRoles("ERU_ADMIN", "SUBSTATION_ADMIN"), responderController.getAllResponders);

// ALL AUTHENTICATED
router.get("/:id", verifyToken, allowRoles("ERU_ADMIN", "SUBSTATION_ADMIN"), responderController.getResponderById);

module.exports = router;