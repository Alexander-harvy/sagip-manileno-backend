const express = require("express");
const router = express.Router();

const {
  createSubstation,
  getSubstations,
} = require("../controllers/substationController");

const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

router.post(
  "/",
  verifyToken,
  allowRoles("ERU_ADMIN"),
  createSubstation
);

router.get(
  "/",
  verifyToken,
  allowRoles("ERU_ADMIN", "SUBSTATION_ADMIN"),
  getSubstations
);

module.exports = router;