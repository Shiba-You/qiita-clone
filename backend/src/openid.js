const { Issuer } = require("openid-client");

let client;
async function getClient() {
  if (client) return client;
  const redirect_uris =
    process.env.NODE_ENV == "production"
      ? `${process.env.BACKEND_URL}/api/auth/mypage`
      : `${process.env.BACKEND_URL}:${process.env.PORT}/api/auth/mypage`;

  const issuer = await Issuer.discover(process.env.IDP_URL);
  client = new issuer.Client({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uris: [redirect_uris],
    response_types: ["code"],
  });
}

module.exports = getClient;
