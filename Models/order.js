import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Order = sequelize.define(
    "Order",
    {
      Id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },

      OrderNumber: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },

      TableId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      CustomerId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      OpenAccountId: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },

      OrderType: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },

      OrderStatus: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },

      TotalAmount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
      },

      OrderDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "Order",
      schema: "Restaurant",
      timestamps: false,
    }
  );

  return Order;
};
