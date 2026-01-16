import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "Customer",
    {
      Id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      CustomerName: { type: DataTypes.STRING(200), allowNull: true },
      TelephoneNo: { type: DataTypes.STRING(30), allowNull: true },
    },
    {
      tableName: "Customer",
      schema: "Restaurant",
      timestamps: false,
    }
  );
};
