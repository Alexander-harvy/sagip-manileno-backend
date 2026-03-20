const express = require("express");
const router = express.Router();
const responderController = require("../controllers/responderController");

const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

// PUBLIC
router.post("/login", responderController.loginResponder);

// ADMIN ONLY (create responder)
router.post("/", verifyToken, allowRoles("admin"), responderController.createResponder);

// ADMIN + RESPONDER
router.get("/", verifyToken, allowRoles("admin", "responder"), responderController.getAllResponders);

// ALL AUTHENTICATED
router.get("/:id", verifyToken, allowRoles("admin", "responder"), responderController.getResponderById);

module.exports = router;