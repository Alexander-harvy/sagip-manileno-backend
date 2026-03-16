const express = require("express");
const router = express.Router();
const offlineLogController = require("../controllers/offlineLogController");

router.post("/", offlineLogController.createOfflineLog);
router.get("/", offlineLogController.getAllOfflineLogs);

module.exports = router;