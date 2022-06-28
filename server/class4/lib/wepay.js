const { wepay: WechatPay } = require("koa3-wechat");
const WXPay = require("weixin-pay");
const fs = require("fs");

let config = {
  appId: "wx06fa4c619b9835ff",
  mchId: "1603774735",
  notifyUrl: "http://www.example.com/wechat/notify",
  partnerKey: "0ZIQofgaZWeee829KA1OFcbndxgr1hOg",
  pfx: fs.readFileSync(__dirname + "/apiclient_cert.p12"),
};
let wepay = new WechatPay(config);
let werund = new WXPay(config);
module.exports = {wepay,werund};
