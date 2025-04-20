const jwt = require("jsonwebtoken");
const { generators } = require("openid-client");
const getClient = require("../openid");

const test = (req, res) => {
  const NODE_ENV = process.env.NODE_ENV;

  console.log(NODE_ENV);

  res.json({ NODE_ENV });
};

const login = async (req, res) => {
  const client = await getClient();
  const nonce = generators.nonce();
  const state = generators.state();

  req.session.nonce = nonce;
  req.session.state = state;

  const authUrl = client.authorizationUrl({
    scope: "phone openid email",
    state: state,
    nonce: nonce,
  });

  console.log("authUrl");
  console.log(authUrl);

  res.json({ authUrl });
};

const mypage = async (req, res) => {
  try {
    const client = await getClient();

    const params = client.callbackParams(req);

    const tokenSet = await client.callback(
      `${process.env.BACKEND_URL}:${process.env.PORT}/api/auth/mypage`,
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
      process.env.JWT_SECRET,
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
    res.redirect(`${process.env.FRONT_URL}/mypage`);
  } catch (err) {
    console.error("Callback error:", err);
    console.log(process.env.JWT_SECRET);
    res.redirect("/");
  }
};

const logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.sendStatus(500);
    }
    res.clearCookie("authToken");
    const logoutUrl = process.env.LOGOUT_URL;
    res.redirect(logoutUrl);
  });
};

const checkAuth = async (req, res) => {
  res.sendStatus(200);
};

module.exports = { test, login, mypage, logout, checkAuth };
