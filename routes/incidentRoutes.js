const express = require("express");
const router = express.Router();
const incidentController = require("../controllers/incidentController");

router.post('/incidents', incidentController.createIncident);
router.get('/incidents', incidentController.getAllIncidents);

module.exports = router;