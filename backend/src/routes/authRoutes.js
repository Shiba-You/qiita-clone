const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.get("/test", authController.test);
router.get("/login", authController.login);
router.get(
  // getPathFromURL("http://localhost:3000/api/auth/mypage"),
  "/mypage",
  authController.mypage
);
router.get("/check-auth", authenticateToken, authController.checkAuth);

module.exports = router;
