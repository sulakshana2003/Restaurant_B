import express from "express";
import {
  getAllMenuItems,
  getAllCategories,
  getMenuItemsBySubCategory,
} from "../Controller/MenuItemController.js";

const menuItemRouter = express.Router();

menuItemRouter.get("/", getAllMenuItems);
menuItemRouter.get("/categories", getAllCategories);
menuItemRouter.get("/getBySub", getMenuItemsBySubCategory);

export default menuItemRouter;
