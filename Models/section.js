import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Section = sequelize.define(
    "Section",
    {
      Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      SectionName: {
        type: DataTypes.ENUM("Kitchen", "Grocery"),
        allowNull: false,
      },
      PrinterName: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },
    {
      tableName: "Section",
      schema: "Restaurant",
      timestamps: false,
    },
  );
  return Section;
};
