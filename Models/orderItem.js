import { DataTypes } from "sequelize";

export default (sequelize) => {
  const OrderItem = sequelize.define(
    "OrderItem",
    {
      Id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },

      OrderId: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },

      MenuItemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      StationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      Quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },

      Note: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },

      ItemStatus: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "Pending",
      },
    },
    {
      tableName: "OrderItem",
      schema: "Restaurant",
      timestamps: false,
    }
  );

  return OrderItem;
};
