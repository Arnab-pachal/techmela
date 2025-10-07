import express from "express";
import { app, server } from "./lib/socket.js";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/auth.route.js";
import { connectDb } from "./lib/db.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import announce from "./routes/announce.route.js";
import teamRoute from "./routes/team.route.js";

dotenv.config();

// Middleware setup
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT"],
  })
);

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/auth", router);
app.use("/announce", announce);
app.use("/team", teamRoute);

// 🔥 PORT binding for Render
const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
  connectDb();
});
