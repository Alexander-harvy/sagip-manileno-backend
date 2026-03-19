const express = require("express");
const router = express.Router();
const {
  createAdmin,
  getAllAdmins,
  getAdminById,
  loginAdmin
} = require("../controllers/adminController");

const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

// PUBLIC
router.post("/login", loginAdmin);

// PROTECTED (ADMIN ONLY)
router.post("/", verifyToken, allowRoles("admin"), createAdmin);
router.get("/", verifyToken, allowRoles("admin"), getAllAdmins);
router.get("/:id", verifyToken, allowRoles("admin"), getAdminById);

module.exports = router;