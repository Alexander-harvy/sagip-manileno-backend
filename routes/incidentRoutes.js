const express = require("express");
const router = express.Router();
const incidentController = require("../controllers/incidentController");
const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

// USER CREATES INCIDENT
router.post("/", verifyToken, allowRoles("user"), incidentController.createIncident);

// ERU + SUBSTATION ADMIN CAN VIEW INCIDENTS
router.get(
  "/",
  verifyToken,
  allowRoles("ERU_ADMIN", "SUBSTATION_ADMIN"),
  incidentController.getAllIncidents
);

// ERU ADMIN ASSIGNS SUBSTATION
router.post(
  "/assign",
  verifyToken,
  allowRoles("ERU_ADMIN"),
  incidentController.assignIncident
);

module.exports = router;