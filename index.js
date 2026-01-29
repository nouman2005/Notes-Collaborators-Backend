import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import userRoutes from "./Routes/userRoutes.js";
import noteRoutes from "./Routes/noteRoutes.js";
import collaboratorRoutes from "./Routes/collaboratorRoutes.js";
import activeRoutes from "./Routes/activeRoutes.js";

import ConnectDB from "./Config/db.js";
import socketHandler from "./Config/socket.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/notes", noteRoutes);
app.use("/api/v1/collaborator", collaboratorRoutes);
app.use("/api/v1/active", activeRoutes);

app.get("/", (req, res) => {
  res.send("<h1>SuccessFully Connected</h1>");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
});

socketHandler(io);

server.listen(process.env.PORT, () => {
  console.log(`✅ Server running on port ${process.env.PORT}`);
});
