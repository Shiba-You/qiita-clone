const express = require("express");
const session = require("express-session");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");

// const path = require("path");
const passport = require("passport");
// const fs = require("fs");
const jwt = require("jsonwebtoken");

const SamlStrategy = require("passport-saml").Strategy;

const expressServer = () => {
  const sessionOptions = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: true, // 開発環境 (HTTP) では false。本番環境 (HTTPS) では true にする
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

  // saml認証用
  // SAMLストラテジーの設定
  const samlStrategy = new SamlStrategy(
    {
      entryPoint:
        "https://localhost:8443/realms/qiita-clone/protocol/saml/clients/test",
      issuer: "http://localhost:3000/api/saml/metadata",
      callbackUrl: "http://localhost:3000/api/saml/acs",
      // cert: fs.readFileSync(
      //   path.join(__dirname, "certs/idp/cert.pem"),
      //   "utf-8"
      // ), // IdPの公開鍵証明書
      cert: "MIICpTCCAY0CBgGWpeJvWDANBgkqhkiG9w0BAQsFADAWMRQwEgYDVQQDDAtxaWl0YS1jbG9uZTAeFw0yNTA1MDYxMzU1MDJaFw0zNTA1MDYxMzU2NDJaMBYxFDASBgNVBAMMC3FpaXRhLWNsb25lMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA49Fmaj/zaRfaKNgDrAR3CuFfIbpvKD86jSY005J7l//PO7xpggqKx3nbHMoNRqd1OPGyjaBln+YIezHpy0NxQ9uIv6X59HZGRBtORT0tp4OLGD0O8d/gElVjJq2bNY7qGy+4D5j+LhHN33ldSmyqq9KfAYnbIKFAYaX8JcV4dO6e3suQQsOzJ2YC5mbidkQ57Pjx3PRwTQaFd6TtxdjqNRueWooJlFhAVndMd3PIIfDtTVXCgLOzhEGgpPUf/PI+jVFZ75DUHVJ0/v4kz0LV4O+cha8IahK495W8o/+2q71jDSl/C+O5MYEyh3+UX4h/zsu1t6rj1BXbpdb56XCKDQIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQC+mvV9SZl6ebCcoL10w3lVPJZ/BTZqbYy7cHF2iQ9EZI1JrtdYx2SyGS8AU26V0dPoOAUjzzaPsdoGpzGdHGxQVHWQpbTYmPgbTbuFZcEBmuW9kdgqgvyacfokHI89SIkdocAQe8M3f+iI+7HK0Kq2o+Bz7Yc3vgZacjqX4bG0QVyzHVE3leVTxAVGdgsFuNIMAfqYSBIuL7dCFolMguYbLv1o4KMI8RYbNIGMeed3N+pnyTXI7SfMzMbVBD/kP//OW2P0i0PuxQ/2P28fp8ItxBoYiUSYdpmJUvOJN8FL7cpo5FogJ5+das9PkC4z/PNe8D30Jm6zlrWWoF/Dz3wz",
      privateCert: "", // 本来は、sp側の公開鍵 fs.readFileSync("./cert/sp-key.pem", "utf-8"),
      decryptionPvk: "", // 本来は、sp側の公開鍵 fs.readFileSync("./cert/sp-key.pem", "utf-8"),
      // signatureAlgorithm: "sha256",
    },
    (profile, done) => {
      return done(null, profile);
    }
  );

  passport.use(samlStrategy);
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));

  app.use((err, req, res, next) => {
    console.error("🔥 エラーハンドラが補足:", err);
    res.status(500).send("Internal error");
  });

  app.use(express.urlencoded({ extended: true }));
  app.use(passport.initialize());
  app.use(passport.session());

  // saml認証用 API
  app.get(
    "/api/saml/login",
    passport.authenticate("saml", { failureRedirect: "/", failureFlash: true }),
    (req, res) => {
      // このコールバックには来ない（リダイレクトで処理されるため）
    }
  );

  app.get("/api/saml/metadata", (req, res) => {
    res.type("application/xml");
    res.status(200).send(
      samlStrategy.generateServiceProviderMetadata(
        ""
        // fs.readFileSync("./cert/sp-cert.pem", "utf-8")
      )
    );
  });

  app.post(
    "/api/saml/acs",
    passport.authenticate("saml", {
      failureRedirect: "http://localhost:5173/login",
      failureFlash: true,
    }),
    (req, res) => {
      // const samlResponse = req.body.SAMLResponse;
      // console.log(req.body);
      // if (samlResponse) {
      //   const decoded = Buffer.from(samlResponse, "base64").toString("utf8");
      //   console.log("📦 デコードしたSAML Response:\n", decoded);
      // }

      const user = req.user;
      console.log("===============user====================");
      console.log(user);
      const token = jwt.sign(
        {
          userId: user.surname,
          email: user.email, // or user.email, depending on your SAML attributes
        },
        process.env.JWT_SECRET, // TODO: 環境変数から取得するのがベスト
        { expiresIn: "1h" }
      );

      // フロントにリダイレクト（tokenをクエリに載せる）
      res.cookie("authToken", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false, // 開発環境 (HTTP) では false。本番環境 (HTTPS) では true にする
        maxAge: 1000 * 60 * 60 * 24, // Cookie の有効期限 (例: 1日)
      });
      res.redirect(`http://localhost:5173/mypage`);
    }
  );

  return app;
};

module.exports = { expressServer };
