const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post('/', userController.createUser);
router.get('/', userController.getAllUsers);
router.post('/login', userController.loginUser);
router.get('/:id/Users', userController.getUserById);

module.exports = router;