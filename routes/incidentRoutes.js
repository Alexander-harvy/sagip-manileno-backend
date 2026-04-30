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

router.post(
  "/status",
  verifyToken,
  allowRoles("SUBSTATION_ADMIN", "responder"),
  incidentController.updateIncidentStatus
);

router.post(
  "/assign-responder",
  verifyToken,
  allowRoles("SUBSTATION_ADMIN"),
  incidentController.assignResponder
);

router.get(
  "/:id/status-history",
  verifyToken,
  allowRoles("user", "ERU_ADMIN", "SUBSTATION_ADMIN", "responder"),
  incidentController.getIncidentStatusHistory
);

module.exports = router;