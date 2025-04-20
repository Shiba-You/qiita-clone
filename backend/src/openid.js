const { Issuer } = require("openid-client");

let client;
async function getClient() {
  if (client) return client;

  const issuer = await Issuer.discover(process.env.IDP_URL);
  client = new issuer.Client({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uris: [
      `${process.env.BACKEND_URL}:${process.env.PORT}/api/auth/mypage`,
    ],
    response_types: ["code"],
  });
}

module.exports = getClient;
