const Sequelize = require("sequelize");
const db = require("./mysql-db");

module.exports = db.define(
  "goods_carts",
  {
    id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    goods_id: {
      type: Sequelize.INTEGER(20),
      allowNull: false,
    },
    goods_sku_id: {
      type: Sequelize.INTEGER(20),
      allowNull: false,
    },
    goods_sku_desc:{
      type:Sequelize.TEXT('tiny'),
      allowNull:false
    },
    user_id: {
      type: Sequelize.INTEGER(20),
      allowNull: false,
    },
    num: {
      type: Sequelize.INTEGER(4),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);
