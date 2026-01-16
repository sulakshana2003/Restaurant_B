import { Op, Sequelize } from "sequelize";
import MenuItemModel from "./menuItem.js";
import CategoryItemModel from "./categories.js";
import RestaurantTableModel from "./restaurantTable.js";
import CustomerModel from "./customer.js";
import OpenAccountModel from "./openAccount.js";
import OrderModel from "./order.js";
import OrderItemModel from "./orderItem.js";

const sequelize = new Sequelize("POS", "res", "Res12345!", {
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
const RestaurantTable = RestaurantTableModel(sequelize);
const Customer = CustomerModel(sequelize);
const OpenAccount = OpenAccountModel(sequelize);
const Order = OrderModel(sequelize);
const OrderItem = OrderItemModel(sequelize);

MenuCategory.hasMany(MenuItem, {
  foreignKey: "MenuCategoryId",
});

MenuItem.belongsTo(MenuCategory, {
  foreignKey: "MenuCategoryId",
});

RestaurantTable.hasMany(OpenAccount, { foreignKey: "TableId" });
OpenAccount.belongsTo(RestaurantTable, { foreignKey: "TableId" });

Customer.hasMany(OpenAccount, { foreignKey: "CustomerId" });
OpenAccount.belongsTo(Customer, { foreignKey: "CustomerId" });

RestaurantTable.hasMany(Order, { foreignKey: "TableId" });
Order.belongsTo(RestaurantTable, { foreignKey: "TableId" });

Customer.hasMany(Order, { foreignKey: "CustomerId" });
Order.belongsTo(Customer, { foreignKey: "CustomerId" });

OpenAccount.hasMany(Order, { foreignKey: "OpenAccountId" });
Order.belongsTo(OpenAccount, { foreignKey: "OpenAccountId" });

Order.hasMany(OrderItem, { foreignKey: "OrderId" });
OrderItem.belongsTo(Order, { foreignKey: "OrderId" });

MenuItem.hasMany(OrderItem, { foreignKey: "MenuItemId" });
OrderItem.belongsTo(MenuItem, { foreignKey: "MenuItemId" });

const db = {
  sequelize,
  MenuItem,
  MenuCategory,
  RestaurantTable,
  Customer,
  OpenAccount,
  Order,
  OrderItem,
};

export default db;
