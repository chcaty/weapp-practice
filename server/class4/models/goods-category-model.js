const Sequelize = require("sequelize");
const db = require("./mysql-db");

module.exports = db.define(
  "goods_category",
  {
    id: {
      type: Sequelize.INTEGER(11),
      // 允许为空
      allowNull: false,
      // 主键
      primaryKey: true,
      // 自增
      autoIncrement: true,
    },
    category_name: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);
