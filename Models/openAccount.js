import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "OpenAccount",
    {
      Id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },

      TableId: { type: DataTypes.INTEGER, allowNull: false },
      TelephoneNo: { type: DataTypes.STRING(30), allowNull: true },

      IsOpen: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      OpenedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      ClosedAt: { type: DataTypes.DATE, allowNull: true },

      CustomerId: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      tableName: "OpenAccount",
      schema: "Restaurant",
      timestamps: false,
    }
  );
};
