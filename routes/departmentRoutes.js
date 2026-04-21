const express = require("express");
const router = express.Router();
const {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
} = require("../controllers/departmentController");

const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

// ADMIN ONLY
router.post("/", verifyToken, allowRoles("ERU_ADMIN"), createDepartment);

// AUTHENTICATED
router.get("/", verifyToken, allowRoles("ERU_ADMIN", "SUBSTATION_ADMIN"), getAllDepartments);
router.get("/:id", verifyToken, allowRoles("ERU_ADMIN", "SUBSTATION_ADMIN"), getDepartmentById);

module.exports = router;