const Router = require("@koa/router");
const getRawBody = require("raw-body");
const { wepay, werund } = require("../lib/wepay");
const Order = require("../models/order-model");
const short = require("short-uuid");

// 开放一个路由
const defaultRouter = new Router();
// 这是一个路由中间件
defaultRouter.use(async (ctx, next) => {
  let n = ~~ctx.session.views + 1;
  ctx.session.views = n;
  console.log("views" + n);
  await next();
});
defaultRouter.get("/", function (ctx) {
  let n = ~~ctx.session.views + 1;
  ctx.session.views = n;
  ctx.body = "views" + n;
});
defaultRouter.get("/hi", function (ctx) {
  ctx.body = `hi,Request Body: ${JSON.stringify(ctx.request.body)}`;
  console.log("hi输出完毕");
});

defaultRouter.all("/apis/pay_notify", async (ctx) => {
  console.log("testInLocal", testInLocal);
  var rawText = getRawBody(ctx.req, {
    excode: "utf-8",
  });
  try {
    var retobj = await wepay.notifyParse(rawText);
    console.log("payNotify parsed:", retobj);
    if (retobj) {
      let outTradeNo = retobj.out_trade_no;
      let resultCode = retobj.result_code;
      let payState = 0;
      if (resultCode == "SUCCESS") {
        console.log("SUCCESS", resultCode, outTradeNo);
        payState = 1;
      } else {
        payState = 2;
      }

      let transactionId = retobj.transaction_id;
      let res = await Order.update(
        {
          payState,
          transactionId,
        },
        {
          where: {
            outTradeNo,
          },
        }
      );
      console.log(`支付状态更新${res[0] > 0 ? "成功" : "失败"}`);
    }
    var xml = wepay.notifyResult({ return_code: "SUCEESS", return_msg: "OK" });
    console.log("payNotify xml:", xml);
    ctx.body = xml;
  } catch (e) {
    console.log("payNotify error:", e);
    console.log("pawNofity process", e);
    ctx.body = wepay.notifyResult({
      return_code: "FAILURE",
      return_msg: "Fail",
    });
    ctx.body = xml;
  }
});

defaultRouter.get("/apis/pay_refund", async (ctx) => {
  let { no: out_trade_no } = ctx.request.query;
  debug('pay_fund...')
  var retobj = await wepay.refund({
    out_trade_no,
    out_refund_no: short().new(),
    total_fee: 1,
    refund_fee: 1,
  });
  ctx.status = 200;
  ctx.body = retobj;
});

defaultRouter.get("/apis/pay_refund2", async (ctx) => {
  let { no: out_trade_no } = ctx.request.query;
  var data = {
    out_trade_no,
    out_refund_no: short().new(),
    total_fee: 1,
    refund_fee: 1,
  };
  let res = await (() => {
    return new Promise((resolve, reject) => {
      werund.refund(data, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  })();
  console.log("res", res);
  ctx.status = 200;
  ctx.body = res;
});

module.exports = defaultRouter;
