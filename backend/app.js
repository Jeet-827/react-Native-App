import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import AuthRoute from "./routes/Auth.route.js";
import ConnectMongodb from "./config/Mongodb.js";
import route from "./routes/URL.route.js";
import TokenRoute from "./routes/Token.route.js";
dotenv.config();

const app = express();
ConnectMongodb()
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", AuthRoute);
app.use("/api/", route);
app.use("/api/", TokenRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT,"0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});