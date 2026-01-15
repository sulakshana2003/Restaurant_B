import { DataTypes } from "sequelize";

export default (sequelize) => {
  const MenuItem = sequelize.define(
    "MenuItem",
    {
      Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      MenuCategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      TargetSectionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      ItemName: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },

      ItemNameSinhala: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },

      ItemNameTamil: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },

      Description: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },

      DescriptionSinhala: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },

      DescriptionTamil: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },

      SellingPrice: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
        defaultValue: 0,
      },

      Note: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },

      ImageURL: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },

      IsBreakfast: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      IsLunch: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      IsDinner: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      IsAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },

      IsActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "MenuItem",
      schema: "Restaurant",
      timestamps: false,
    }
  );

  return MenuItem;
};
