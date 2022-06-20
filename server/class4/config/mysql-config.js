var config = {
  database: "practice",
  username: "root", // 用户名
  password: "root", // 口令
  host: "localhost", // 主机名
  port: 3306, // 端口号，MySQL默认3306
  define: {
    // 是否冻结表名, 默认表名会转换为复数形式
    freezeTableName: true,
    // 是否为表添加 createdAt 和 updatedAt 字段
    // createdAt 记录表的创建时间
    // updatedAt 记录字段更新时间
    timestamps: true,
    // 是否为表添加 deletedAt 字段
    // 默认情况下, destroy() 方法会删除数据，设置 paranoid 为 true 时，将会更新 deletedAt 字段，并不会真实删除数据。
    paranoid: false,
  },
  dialect: "mysql",
};
module.exports = config;
