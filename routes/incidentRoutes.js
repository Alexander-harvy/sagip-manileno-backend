const express = require("express");
const router = express.Router();
const incidentController = require("../controllers/incidentController");

router.post("/", incidentController.createIncident);
router.get("/", incidentController.getAllIncidents);
router.get("/:id", incidentController.getIncidentById);

router.post("/:id/assign", incidentController.assignResponder);
router.get("/:id/assignments", incidentController.getIncidentAssignments);

router.post("/:id/status", incidentController.updateIncidentStatus);
router.get("/:id/status", incidentController.getIncidentStatuses);

module.exports = router;