const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  })
);

const messageRoutes = require("./routes/messageRoutes");
const authRoutes = require("./routes/authRoutes");

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/api/v1/message", messageRoutes);
app.use("/api/v1/auth", authRoutes);

module.exports = app;
