console.log("adminRoutes loaded");
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { assignIncident } = require("../controllers/incidentController");

router.post("/bootstrap", adminController.bootstrapAdmin);
router.post("/login", adminController.loginAdmin);
router.post("/", adminController.createAdmin);
router.get("/", adminController.getAllAdmins);
router.get("/:id", adminController.getAdminById);

router.post("/assign", assignIncident);

module.exports = router;