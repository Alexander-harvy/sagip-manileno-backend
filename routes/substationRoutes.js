const express = require("express");
const router = express.Router();
const { getSubstations } = require("../controllers/substationController");

const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

router.get("/", verifyToken, allowRoles("ERU_ADMIN", "SUBSTATION_ADMIN"), getSubstations);

module.exports = router;