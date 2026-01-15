// fetch all data from MenuItem table
import db from "../Models/index.js";

export const getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await db.MenuItem.findAll();
    res.status(200).json(menuItems);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch menu items", details: error.message });
  }
};

// get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await db.MenuCategory.findAll({
      where: { ParentCategoryId: null },
      order: [["DisplayOrder", "ASC"]],
      include: [
        {
          model: db.MenuCategory,
          as: "SubCategories",
          required: false,
          order: [["DisplayOrder", "ASC"]],
        },
      ],
    });
    res.status(200).json(categories);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch categories", details: error.message });
  }
};

//GET /menu/products?subCategoryId=xxx to get products by subcategory
export const getMenuItemsBySubCategory = async (req, res) => {
  const { subCategoryId } = req.query;
  try {
    const menuItems = await db.MenuItem.findAll({
      where: { MenuCategoryId: subCategoryId },
    });
    res.status(200).json(menuItems);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch menu items", details: error.message });
  }
};
