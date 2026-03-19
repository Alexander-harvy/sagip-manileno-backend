const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

// PUBLIC
router.post('/', userController.createUser);
router.post('/login', userController.loginUser);

// ADMIN ONLY
router.get('/', verifyToken, allowRoles("admin"), userController.getAllUsers);

// AUTHENTICATED USER
router.get('/:id', verifyToken, allowRoles("admin", "user"), userController.getUserById);

module.exports = router;