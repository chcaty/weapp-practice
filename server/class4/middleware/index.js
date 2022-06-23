const logger = require("koa-logger");
const koaBody = require("koa-body");
const serve = require("koa-static-server");
const path = require("path");
const session = require("koa-session");
const store = require("koa-session-local");
const render = require("koa-art-template");
// npm install html-minifier -S
// -S就是--save的简写
const htmlMinifier = require("html-minifier");
const dateFormat = require("../lib/date-format");
// console.log( dataFormat(new Date(), "yyyy-MM-dd hh:mm:ss"))

module.exports = (app) => {
  app.use(logger());
  app.use(koaBody({
    multipart:true,
    strict:false
  })); //parse request.body

  // 静态文件，自动跳过koajwt检测了
  app.use(serve({ rootDir: "static", rootPath: "/static" }));

  render(app, {
    root: path.join(__dirname, "../views"),
    minimize: true,
    htmlMinifier: htmlMinifier,
    htmlMinifierOptions: {
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true,
      // 运行时自动合并：rules.map(rule => rule.test)
      ignoreCustomFragments: [],
    },
    escape: true,
    extname: ".html",
    debug: process.env.NODE_ENV !== "production",
    imports: {
      dateFormat,
    },
  });

  // log
  app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get("X-Response-Time");
    console.log(`执行时间：${ctx.method} ${ctx.url} - ${rt}`);
  });

  // x-response-time
  app.use(async (ctx, next) => {
    const start = Date.now();
    console.log("记录开始时间");
    await next();
    const ms = Date.now() - start;
    ctx.set("X-Response-Time", `${ms}ms`);
  });

  // 设置签名的 Cookie 密钥
  app.keys = ["koakeys"];
  // session
  // cookie中设置了HttpOnly属性,那么通过js脚本将无法读取到cookie信息
  // signed = false 时，app.keys 不赋值没有关系；如果 signed: true 时，则需要对 app.keys 赋值，否则会报错。
  const CONFIG = {
    store: new store(),
    key: "koa.sess" /** (string) cookie key (default is koa.sess) */,
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    autoCommit: true /** (boolean) automatically commit headers (default true) */,
    overwrite: true /** (boolean) can overwrite or not (default true) */,
    httpOnly: true /** (boolean) httpOnly or not (default true) */,
    signed: true /** (boolean) signed or not (default true) */,
    rolling: false /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */,
    renew: false /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/,
    secure: false /** (boolean) secure cookie*/,
    sameSite:
      null /** (string) session cookie sameSite options (default null, don't set it) */,
  };
  // Error: Cannot send secure cookie over unencrypted connection
  // 将 secure 改为false，在本地测试
  app.use(session(CONFIG, app));

  // Cannot set headers after they are sent to the client
  // cookie
  app.use(async function (ctx, next) {
    const n = ~~ctx.cookies.get("view") + 1;
    ctx.cookies.set("view", n, { httpOnly: false });
    // 中间件调用next要加await,否则报错404
    await next();
  });
  // use session
};
