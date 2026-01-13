const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth.middleware");
const authController = require("../controllers/auth.controller");

// Register e login sono pubbliche, /me è protetta da JWT
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/me", auth, authController.me);

module.exports = router;
