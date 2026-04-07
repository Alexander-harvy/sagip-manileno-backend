const express = require("express");
const router = express.Router();
const incidentController = require("../controllers/incidentController");
const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

router.get("/", verifyToken, allowRoles("ERU_ADMIN", "SUBSTATION_ADMIN"), incidentController.getAllIncidents);
router.get("/:id", verifyToken, allowRoles("ERU_ADMIN", "SUBSTATION_ADMIN", "user"), incidentController.getIncidentById);

router.post("/:id/assign", verifyToken, allowRoles("ERU_ADMIN"), incidentController.assignResponder);
router.get("/:id/assignments", verifyToken, allowRoles("ERU_ADMIN", "SUBSTATION_ADMIN"), incidentController.getIncidentAssignments);

router.post("/:id/status", verifyToken, allowRoles("SUBSTATION_ADMIN"), incidentController.updateIncidentStatus);
router.get("/:id/status", verifyToken, allowRoles("ERU_ADMIN", "SUBSTATION_ADMIN"), incidentController.getIncidentStatuses);

//router.get("/:id", verifyToken, allowRoles("admin", "responder", "user"), incidentController.getIncidentById);

//router.post("/:id/assign", verifyToken, allowRoles("admin"), incidentController.assignResponder);
//router.get("/:id/assignments", verifyToken, allowRoles("admin", "responder"), incidentController.getIncidentAssignments);

//router.post("/:id/status", verifyToken, allowRoles("responder"), incidentController.updateIncidentStatus);
//router.get("/:id/status", verifyToken, allowRoles("admin", "responder"), incidentController.getIncidentStatuses);


module.exports = router;