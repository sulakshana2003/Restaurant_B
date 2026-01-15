import express from "express";
import cors from "cors";
import dotenv from "dotenv/config.js";
import db from "./Models/index.js";
import menuItemRouter from "./Routes/MenuItemRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Restaurant B API");
});
app.use("/api/menu", menuItemRouter);

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log("✅ Connected to SQL Server successfully");
  } catch (err) {
    console.error("❌ Connection failed:", err);
  }
})();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
