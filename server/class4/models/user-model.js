const Sequelize = require("sequelize");
const db = require("./mysql-db");

module.exports = db.define(
  "user",
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
    nickName: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    avatarUrl: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    gender: {
      type: Sequelize.INTEGER,
    },
    language: {
      type: Sequelize.STRING(10),
    },
    city: {
      type: Sequelize.STRING(20),
    },
    province: {
      type: Sequelize.STRING(20),
    },
    country: {
      type: Sequelize.STRING(10),
    },
    openId: {
      type: Sequelize.STRING(32),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);
