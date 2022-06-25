const { wepay: WechatPay } = require("koa3-wechat");
const fs = require("fs");

let config = {
  appId: "wx06fa4c619b9835ff",
  mch_id: "1603774735",
  notify_url: "http://www.example.com/wechat/notify",
  partnerKey: "0ZIQofgaZWeee829KA1OFcbndxgr1hOg",
  pfx: fs.readFileSync(__dirname + "/apiclient_cert.p12"),
  passphrase: "passphrase",
};
let wepay = new WechatPay(config);
module.exports = wepay;
