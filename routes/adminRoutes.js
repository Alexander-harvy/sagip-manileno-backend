const express = require("express");
const router = express.Router();
const {
  createAdmin,
  getAllAdmins,
  getAdminById,
  loginAdmin
} = require("../controllers/adminController");

router.post("/", createAdmin);
router.get("/", getAllAdmins);
router.post("/login", loginAdmin);
router.get("/:id/Admins", getAdminById);



module.exports = router;