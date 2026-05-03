const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");

const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

router.post("/bootstrap", adminController.bootstrapAdmin);
router.post("/login", adminController.loginAdmin);

router.put(
  "/me",
  verifyToken,
  allowRoles("ERU_ADMIN", "SUBSTATION_ADMIN"),
  adminController.updateMyProfile
);

router.put(
  "/change-password",
  verifyToken,
  allowRoles("ERU_ADMIN", "SUBSTATION_ADMIN"),
  adminController.changeMyPassword
);

router.post(
  "/",
  verifyToken,
  allowRoles("ERU_ADMIN"),
  adminController.createAdmin
);

router.get(
  "/",
  verifyToken,
  allowRoles("ERU_ADMIN"),
  adminController.getAllAdmins
);

router.get(
  "/:id",
  verifyToken,
  allowRoles("ERU_ADMIN"),
  adminController.getAdminById
);

module.exports = router;