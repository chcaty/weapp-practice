const Sequelize = require("sequelize");
const db = require("./mysql-db");

module.exports = db.define(
  "goods_attr_key",
  {
    id: {
      type: Sequelize.INTEGER(11),
      allowNull: false, // 是否允许为空
      primaryKey: true, // 是否主键
      autoIncrement: true, // 是否自增
    },
    goods_id: {
      //商品id
      type: Sequelize.INTEGER(20),
      allowNull: false,
    },
    attr_name: {
      //规格名称
      type: Sequelize.STRING(50),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);