import express from "express";
import { or } from "sequelize";
import { placeOrder, cancelOrderItem } from "../Controller/orderController.js";

const OrderRouter = express.Router();

OrderRouter.post("/place", placeOrder);
OrderRouter.patch("/items/:orderItemId/cancel", cancelOrderItem);

export default OrderRouter;
