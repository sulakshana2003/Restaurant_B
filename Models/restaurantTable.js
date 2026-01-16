import { DataTypes } from "sequelize";

export default (sequelize) => {
  const RestaurantTable = sequelize.define(
    "RestaurantTable",
    {
      Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      TableName: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },

      Capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },

      CurrentStatus: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "Available",
      },
    },
    {
      tableName: "RestaurantTable",
      schema: "Restaurant",
      timestamps: false,
    }
  );

  return RestaurantTable;
};
