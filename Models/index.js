import { Sequelize } from "sequelize";
import MenuItemModel from "./menuItem.js";
import CategoryItemModel from "./categories.js";

const sequelize = new Sequelize("POS", "pos", "2003", {
  dialect: "mssql",
  host: "localhost",
  port: 1433,
  dialectOptions: {
    options: {
      trustServerCertificate: true,
    },
  },
  logging: false,
});

const MenuItem = MenuItemModel(sequelize);
const MenuCategory = CategoryItemModel(sequelize);

const db = {
  sequelize,
  MenuItem,
  MenuCategory,
};

export default db;
