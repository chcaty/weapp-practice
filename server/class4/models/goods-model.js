const Sequelize = require("sequelize");
const db = require("./mysql-db");

module.exports = db.define(
  "goods",
  {
    id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    spu_no: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    goods_name: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    goods_desc: {
      type: Sequelize.TEXT("tiny"),
      allowNull: false,
    },
    start_price: {
      type: Sequelize.DECIMAL(9, 2),
      allowNull: false,
    },
    category_id: {
      type: Sequelize.BIGINT(11),
      allowNull: false,
    },
    brand_id: {
      type: Sequelize.BIGINT(11),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);
