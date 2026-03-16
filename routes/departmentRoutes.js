const express = require("express");
const router = express.Router();
const {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
} = require("../controllers/departmentController");

router.post("/", createDepartment);
router.get("/", getAllDepartments);
router.get("/:id/Departments", getDepartmentById);

module.exports = router;