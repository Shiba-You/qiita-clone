const { Issuer } = require("openid-client");

let client;
async function getClient() {
  if (client) return client;

  const issuer = await Issuer.discover(
    "https://cognito-idp.ap-northeast-1.amazonaws.com/ap-northeast-1_4P1Q5FqRt"
  );
  client = new issuer.Client({
    client_id: "76h33purbs82ttqho4q9d3f7t6",
    client_secret: "hoqsc1vthgaap7c2dpn5cpde1i6gii4ti0s9aoigt3ce4n6sj8a",
    redirect_uris: ["http://localhost:3000/api/auth/mypage"],
    response_types: ["code"],
  });
}

module.exports = getClient;
