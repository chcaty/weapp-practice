const Sequelize = require("sequelize");
const db = require("./mysql-db");

module.exports = db.define(
  "brand",
  {
    id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    brand_name: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);
