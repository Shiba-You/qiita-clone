const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticateToken } = require("../middleware/authMiddleware");

const getPathFromURL = (urlString) => {
  try {
    const url = new URL(urlString);
    return url.pathname;
  } catch (error) {
    console.error("Invalid URL:", error);
    return null;
  }
};

router.get("/login", authController.login);
router.get(
  // getPathFromURL("http://localhost:3000/api/auth/mypage"),
  "/mypage",
  authController.mypage
);
router.get("/check-auth", authenticateToken, authController.checkAuth);

module.exports = router;
