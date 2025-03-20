const app = require("./app");
const path = require("path");
const http = require("http");
const dotenv = require("dotenv");
const cron = require("cron");
const mongoose = require("mongoose");
// const socketApi = require("./utils/socketsIo");

const cors = require("cors");

app.use(cors());
app.options("*", cors());

const result = dotenv.config({ path: "config.env" });
if (result.error) {
  console.error("Dotenv error:", result.error);
} else {
  console.log("Dotenv loaded:", result.parsed);
}

const server = http.createServer(app);
const port = process.env.PORT;
const DB = process.env.MONGO_URL;

console.log("DB IS : ", DB);

mongoose
  .connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((con) => console.log("Connection established successfully right now !"))
  .catch((err) =>
    console.log(
      "Error occurred during connection !",
      "Error message is : ",
      err.message
    )
  );

// console.log("ERROR FOUND.");
// socketApi.io.attach(server, {
//   cors: {
//     origin: "*",
//   },
// });

server.listen(port, () => {
  if (process.env.NODE_ENV === "development") {
    console.log(`Server is running on port ${port} in development mode.`);
  } else {
    console.log(`Server is running on port ${port} in production mode.`);
  }
});
