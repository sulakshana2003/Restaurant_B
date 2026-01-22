import express from "express";
import {
  getMonitorItems,
  serveOrderItem,
} from "../Controller/stewardController.js";

const stewardrouter = express.Router();

stewardrouter.get("/", getMonitorItems);
stewardrouter.patch("/:id/serve", serveOrderItem);

export default stewardrouter;
