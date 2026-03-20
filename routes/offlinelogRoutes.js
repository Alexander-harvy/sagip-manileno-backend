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
router.post("/", verifyToken, allowRoles("admin"), createDepartment);

// AUTHENTICATED
router.get("/", verifyToken, allowRoles("admin", "responder"), getAllDepartments);
router.get("/:id", verifyToken, allowRoles("admin", "responder"), getDepartmentById);

module.exports = router;