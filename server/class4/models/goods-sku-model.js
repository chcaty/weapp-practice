const Sequelize = require("sequelize");
const db = require("./mysql-db");

module.exports = db.define(
  "goods_sku",
  {
    id: {
      type: Sequelize.INTEGER(11),
      allowNull: false, // 是否允许为空
      primaryKey: true, // 是否主键
      autoIncrement: true, // 是否自增
    },
    goods_id: {
      type: Sequelize.INTEGER(20),
      allowNull: false,
    },
    goods_attr_path: {
      //规格搭配路径，例如"1,3"
      type: Sequelize.JSON,
      allowNull: false,
    },
    price: {
      //售价，单位分
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    stock: {
      //库存
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);
