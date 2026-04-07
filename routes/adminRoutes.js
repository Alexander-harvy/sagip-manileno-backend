const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.post("/bootstrap", adminController.bootstrapAdmin);
router.post("/login", adminController.loginAdmin);
router.post("/", adminController.createAdmin);
router.get("/", adminController.getAllAdmins);
router.get("/:id", adminController.getAdminById);

module.exports = router;