const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const { Issuer, generators } = require("openid-client");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();

const JWT_SECRET = "hogehoge"; // 秘密鍵 (環境変数などで管理)

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

// >>> 6. セッションミドルウェアを設定します。
app.use(
  session({
    secret: "hogehoge",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // 開発環境 (HTTP) では false。本番環境 (HTTPS) では true にする
      maxAge: 1000 * 60 * 60 * 24, // Cookie の有効期限 (例: 1日)
    },
  })
);

const corsOptions = {
  origin: "http://localhost:5173", // フロントエンドのオリジンを許可
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS", // 許可するメソッド
  allowedHeaders: ["Content-Type", "Authorization"], // 許可するヘッダー
  credentials: true, // Cookie 等の認証情報を含むリクエストを許可
  optionsSuccessStatus: 200, // OPTIONS リクエストへのレスポンスステータス (古いブラウザ向け)
};
app.use(cors(corsOptions));

app.use(cookieParser());

app.get("/hoge", (req, res) => {
  res.json({ hoge: "Hello World!" });
});
app.use(express.json());

// cognito の設定

// >>> 5. ユーザープールの OIDC プロパティの値を使用して openid-client を設定します。
let client;
// Initialize OpenID Client
async function initializeClient() {
  const issuer = await Issuer.discover(
    "https://cognito-idp.ap-northeast-1.amazonaws.com/ap-northeast-1_4P1Q5FqRt"
  );
  client = new issuer.Client({
    client_id: "76h33purbs82ttqho4q9d3f7t6",
    client_secret: "hoqsc1vthgaap7c2dpn5cpde1i6gii4ti0s9aoigt3ce4n6sj8a",
    redirect_uris: ["http://localhost:3000/mypage"],
    response_types: ["code"],
  });
}
initializeClient().catch(console.error);

// >>> ユーザーが認証されているかどうかをチェックするミドルウェアコンポーネントを追加します。
const checkAuth = (req, res, next) => {
  if (!req.session.userInfo) {
    req.isAuthenticated = false;
  } else {
    req.isAuthenticated = true;
  }
  next();
};

// >>> 8. アプリケーションのルートで home ルートを設定します。ユーザーの認証状態のチェックを含めます。
app.get("/", checkAuth, (req, res) => {
  // res.set({ "Access-Control-Allow-Origin": "*" });
  res.json({
    isAuthenticated: req.isAuthenticated,
    userInfo: req.session.userInfo,
  });
});

// >>> 9. 認可エンドポイントで認証するために Amazon Cognito マネージドログインに誘導する login ルートを設定します。
app.get("/login", (req, res) => {
  // res.set({
  //   "Access-Control-Allow-Origin": "*",
  // });
  const nonce = generators.nonce();
  const state = generators.state();

  req.session.nonce = nonce;
  req.session.state = state;

  const authUrl = client.authorizationUrl({
    scope: "phone openid email",
    state: state,
    nonce: nonce,
  });

  res.json({ authUrl });
});

// 10. 認証後に Amazon Cognito がリダイレクトする戻り URL のページを設定します。
// Helper function to get the path from the URL. Example: "http://localhost/hello" returns "/hello"
function getPathFromURL(urlString) {
  try {
    const url = new URL(urlString);
    return url.pathname;
  } catch (error) {
    console.error("Invalid URL:", error);
    return null;
  }
}

app.get(getPathFromURL("http://localhost:3000/mypage"), async (req, res) => {
  try {
    const params = client.callbackParams(req);

    const tokenSet = await client.callback(
      "http://localhost:3000/mypage",
      params,
      {
        nonce: req.session.nonce,
        state: req.session.state,
      }
    );

    const userInfo = await client.userinfo(tokenSet.access_token);
    req.session.userInfo = userInfo;

    // JWT を生成
    const token = jwt.sign(
      { userId: userInfo.sub, email: userInfo.email },
      JWT_SECRET,
      {
        expiresIn: "1h", // 有効期限 (適宜設定)
      }
    );

    res.cookie("authToken", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // 開発環境 (HTTP) では false。本番環境 (HTTPS) では true にする
      maxAge: 1000 * 60 * 60 * 24, // Cookie の有効期限 (例: 1日)
    });
    res.redirect("http://localhost:5173/mypage");
  } catch (err) {
    console.error("Callback error:", err);
    res.redirect("/");
  }
});

// 11. ユーザーセッションデータを消去し、Amazon Cognito logout エンドポイントにリダイレクトする logout ルートを設定します。
// Logout route
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.sendStatus(500);
    }
    res.clearCookie("authToken");
    const logoutUrl = `https://ap-northeast-14p1q5fqrt.auth.ap-northeast-1.amazoncognito.com/logout?client_id=76h33purbs82ttqho4q9d3f7t6&logout_uri=<logout uri>`;
    res.redirect(logoutUrl);
  });
});

// JWT を検証するミドルウェア
const authenticateToken = (req, res, next) => {
  const token = req.cookies.authToken; // クッキーから JWT を取得 (またはリクエストヘッダーから)

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden (トークンが無効)
    }
    req.user = user; // デコードされたユーザー情報をリクエストオブジェクトに格納
    next();
  });
};

// JWT 検証が必要なルートの例
app.get("/dashboard-data", authenticateToken, (req, res) => {
  res.json({ message: "Dashboard data for user: " + req.user.email });
});

app.get("/api/check-auth", authenticateToken, (req, res) => {
  res.sendStatus(200); // 認証が成功した場合は 200 OK を返す
});
