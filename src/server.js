const app = require("./app");
const connectDatabase = require("./config/db");
const { serverPort } = require("./secret");

app.listen(serverPort, async () => {
  console.log("Server is running", mongodbURL, "Another one ");
  await connectDatabase();
});
