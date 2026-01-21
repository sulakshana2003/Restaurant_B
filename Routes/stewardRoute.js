import express from "express";
import { getMonitorItems } from "../Controller/stewardController.js";

const stewardrouter = express.Router();

stewardrouter.get("/", getMonitorItems);

export default stewardrouter;
