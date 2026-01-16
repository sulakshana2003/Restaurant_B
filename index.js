import express from "express";
import cors from "cors";
import dotenv from "dotenv/config.js";
import db from "./Models/index.js";
import menuItemRouter from "./Routes/MenuItemRoutes.js";
import tableRouter from "./Routes/TableRoutes.js";
import OpenAccountRouter from "./Routes/OpenAccountRoutes.js";
import OrderRouter from "./Routes/orderRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to Restaurant B API");
});
app.use("/api/menu", menuItemRouter);
app.use("/api/tables", tableRouter);
app.use("/api/openAccounts", OpenAccountRouter);
app.use("/api/orders", OrderRouter);

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log("✅ Connected to SQL Server successfully");
  } catch (err) {
    console.error("❌ Connection failed:", err);
  }
})();

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
