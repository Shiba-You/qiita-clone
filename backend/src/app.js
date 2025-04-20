const express = require("express");
const session = require("express-session");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");

const expressServer = () => {
  const sessionOptions = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // 開発環境 (HTTP) では false。本番環境 (HTTPS) では true にする
      maxAge: 1000 * 60 * 60 * 24, // Cookie の有効期限 (例: 1日)
    },
  };

  const corsOptions = {
    origin: process.env.FRONT_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS", // 許可するメソッド
    allowedHeaders: ["Content-Type", "Authorization"], // 許可するヘッダー
    credentials: true, // Cookie 等の認証情報を含むリクエストを許可
    optionsSuccessStatus: 200, // OPTIONS リクエストへのレスポンスステータス (古いブラウザ向け)
  };

  const app = express();

  app.use(session(sessionOptions));
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(cookieParser());

  app.use("/api/auth", authRoutes);

  return app;
};

module.exports = { expressServer };
