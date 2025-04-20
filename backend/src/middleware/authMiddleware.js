const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.cookies.authToken; // クッキーから JWT を取得 (またはリクエストヘッダーから)

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden (トークンが無効)
    }
    req.user = user; // デコードされたユーザー情報をリクエストオブジェクトに格納
    next();
  });
};

module.exports = { authenticateToken };
