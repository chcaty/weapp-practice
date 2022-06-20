const Router = require("@koa/router");

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

module.exports = defaultRouter;
