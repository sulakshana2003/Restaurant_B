import express from "express";
import {
  startOpenAccount,
  getOpenAccount,
  getOrdersByOpenAccount,
} from "../Controller/OpenAccountController.js";

const OpenAccountRouter = express.Router();

OpenAccountRouter.post("/start", startOpenAccount);
OpenAccountRouter.get("/:id", getOpenAccount);
OpenAccountRouter.get("/:openAccountId/orders", getOrdersByOpenAccount);

export default OpenAccountRouter;
