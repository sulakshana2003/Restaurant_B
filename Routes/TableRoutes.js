import express from "express";
import { listTables, tableStatus } from "../Controller/TableController.js";

const TableRouter = express.Router();

// GET /tables - fetch all restaurant tables with open account info
TableRouter.get("/", listTables);
TableRouter.get("/:tableId/status", tableStatus);

export default TableRouter;
