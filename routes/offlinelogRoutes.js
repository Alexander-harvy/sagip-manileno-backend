const express = require("express");
const router = express.Router();
const offlineLogController = require("../controllers/offlineLogController");

const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

// PUBLIC (SMS/offline ingestion)
router.post("/", offlineLogController.createOfflineLog);

// ADMIN ONLY (view logs)
router.get("/", verifyToken, allowRoles("ERU_ADMIN"), offlineLogController.getAllOfflineLogs);

module.exports = router;