const Sequelize = require("sequelize");
const db = require("./mysql-db");

module.exports = db.define(
  "address",
  {
    id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: Sequelize.INTEGER(20),
      allowNull: false,
    },
    userName: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    telNumber: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    region: {
      type: Sequelize.JSON,
      allowNull: false,
    },
    detailInfo: {
      type: Sequelize.STRING(200),
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["tel_number"],
      },
    ],
    underscored: true,
    freezeTableName: true,
    timestamps: true,
  }
);
