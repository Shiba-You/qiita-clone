const { expressServer } = require("./app");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "./.env.stg") });

const PORT = process.env.PORT;
const app = expressServer();
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
