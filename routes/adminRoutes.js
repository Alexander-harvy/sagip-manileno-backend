const express = require("express");
const router = express.Router();
const {
  createAdmin,
  getAllAdmins,
  getAdminById,
} = require("../controllers/adminController");

router.post("/", createAdmin);
router.get("/", getAllAdmins);
router.get("/:id/Admins", getAdminById);

module.exports = router;