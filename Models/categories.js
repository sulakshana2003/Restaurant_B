import { DataTypes } from "sequelize";

export default (sequelize) => {
  const MenuCategory = sequelize.define(
    "MenuCategory",
    {
      Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      ParentCategoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      CategoryName: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },

      DisplayOrder: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      tableName: "MenuCategory",
      schema: "Restaurant",
      timestamps: false,
    }
  );

  /* Self-referencing association (optional but recommended) */
  MenuCategory.belongsTo(MenuCategory, {
    as: "ParentCategory",
    foreignKey: "ParentCategoryId",
  });

  MenuCategory.hasMany(MenuCategory, {
    as: "SubCategories",
    foreignKey: "ParentCategoryId",
  });

  return MenuCategory;
};
