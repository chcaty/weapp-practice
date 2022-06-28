const short = require("short-uuid");
const { wepay, werund } = require("../lib/wepay");
const Order = require("../models/order-model");

function init(router) {
  router.post("/my/order", async (ctx) => {
    let { openId, uid: userId } = ctx.user;
    let { totalFee, goodsCartsIds, addressId, addressDesc, goodsNameDesc } =
      ctx.request.body;
    totalFee = 1;
    let payState = 0;
    let randStr = short().new();
    let outTradeNo = `${getDateString(new Date())}${randStr.substring(
      0,
      randStr.length - 4
    )}`;
    var tarde = {
      body: goodsNameDesc.substr(0, 100),
      attach: "订单支付",
      out_trade_no: outTradeNo,
      total_fee: totalFee,
      trade_type: "JSAPI",
      spbill_create_ip: ctx.request.ip,
      openid: openId,
    };
    console.log(tarde);
    var params = await wepay.getBrandWCPayRequestParams(tarde);
    console.log(params);
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
    ctx.status = 200;
    ctx.body = {
      code: 200,
      msg: !err ? "ok" : "",
      data: {
        res,
        params,
      },
    };
  });
}

function init2(router) {
  router.post("/my/order2", async (ctx) => {
    let { openId, uid: userId } = ctx.user;
    let { totalFee, goodsCartsIds, addressId, addressDesc, goodsNameDesc } =
      ctx.request.body;
    totalFee = 1;
    let payState = 0;
    let randStr = short().new();
    let outTradeNo = `${getDateString(new Date())}${randStr.substring(
      0,
      randStr.length - 4
    )}`;
    var tarde = {
      body: goodsNameDesc.substr(0, 100),
      out_trade_no: outTradeNo,
      total_fee: totalFee,
      trade_type: "JSAPI",
      notifyUrl: "http://www.example.com/wechat/notify",
      spbill_create_ip: ctx.request.ip,
      openid: openId,
    };
    console.log(tarde);
    var params = await (() => {
      return new Promise((resolve, reject) => {
        werund.getBrandWCPayRequestParams(tarde, (err, result) => {
          console.log(params);
          if(err) reject(err);
          else resolve(result);
        });
      });
    });
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
    ctx.status = 200;
    ctx.body = {
      code: 200,
      msg: !err ? "ok" : "",
      data: {
        res,
        params,
      },
    };
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
  init2,
};
