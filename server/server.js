import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import imageRoute from "./routes/processRoute.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;
app.use(cors());
app.use(express.json());
app.use("/api", imageRoute);

app.listen(() => {
  console.log(`Server is live on ${PORT}`);
});
