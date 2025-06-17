import express from "express";
import cors from "cors";
import morgan from "morgan";
import router from "./routes";
import { errorHandler } from "./middlewares/error.middleware";
import setupSwagger from "./config/swagger/swagger";

const app = express();
setupSwagger(app)

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(errorHandler);
// Routes
app.use("/", router);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

export default app;
