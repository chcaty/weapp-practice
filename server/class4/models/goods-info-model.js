const Sequelize = require("sequelize");
const db = require("./mysql-db");

module.exports = db.define(
  "goods_info",
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
    kind: {
      type: Sequelize.INTEGER(4),
      allowNull: false,
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    goods_id: {
      type: Sequelize.INTEGER(20),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);
