const short = require("short-uuid");
const wepay = require("../lib/wepay");
const Order = require("../models/order-model");

function init(router) {
  router.post("/my/order", async (ctx) => {
    let { openId, uid: userId } = ctx.user;
    let { totalFee, goodsCartsIds, addressId, addressDesc, goodsNameDesc } =
      ctx.request.body;
    totalFee = 1;
    let payState = 0;
    let outTradeNo = `${getDateString(new Date())}${short().generate()}`;
    var tarde = {
      body: goodsNameDesc.substr(0, 20),
      attach: "订单支付",
      out_trade_no: outTradeNo,
      total_fee: totalFee,
      trade_type: "JSAPI",
      spbill_create_ip: ctx.request.ip,
      openid: openId,
    };
    var params = await wepay.getBrandWCPayRequestParams(tarde);
    let err = "",
      res;
    if (params && params.package && params.paySign) {
      res = await Order.create({
        userId,
        goodsCartsIds,
        addressId,
        addressDesc,
        goodsNameDesc,
        totalFee,
        outTradeNo,
        payState,
      });
      if (!res) err = "创建订单失败";
    } else {
      console.log("err! getBrandWCPayRequestParams() return null");
    }
    ctx.status = 200
    ctx.body = {
      code: 200,
      msg: !err ? 'ok' : '',
      data: {
        res,
        params
      }
    }
  });
}

function getDateString(d) {
  var year = d.getFullYear();
  var month = pad(d.getMonth() + 1);
  var day = pad(d.getDate());
  var hour = pad(d.getHours());
  var min = pad(d.getMinutes());
  var sec = pad(d.getSeconds());
  return year + month + day + hour + min + sec;
}

function pad(v) {
  return v < 10 ? "0" + v : v;
}

module.exports = {
  init,
};
