const Sequelize = require("sequelize");
const db = require("./mysql-db");

module.exports = db.define(
  "order",
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
    outTradeNo: {
      // 微信商号单号
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    transactionId: {
      // 微信交易单号
      type: Sequelize.STRING(50),
      allowNull: true, //允许为空
    },
    payState: {
      // 支付订单的状态，0=未支付，1=已支付，2=取消或其它
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    totalFee: {
      //总价，单位分
      type: Sequelize.INTEGER(11),
      allowNull: false,
    },
    addressId: {
      //收货地址id
      type: Sequelize.INTEGER(20),
      allowNull: false,
    },
    addressDesc: {
      //收货地址总描述
      type: Sequelize.TEXT("tiny"), //最大长度255个字节
      allowNull: false,
    },
    goodsCartsIds: {
      //购买车商品ids
      type: Sequelize.JSON,
      allowNull: false,
    },
    goodsNameDesc: {
      //商品名称描述
      type: Sequelize.TEXT("tiny"), //最大长度255个字节
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["out_trade_no"],
      },
    ],
    underscored: true,
    freezeTableName: true,
    timestamps: true,
  }
);
