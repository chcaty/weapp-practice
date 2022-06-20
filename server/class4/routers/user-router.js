const Router = require("@koa/router");
const koajwt = require("koa-jwt");
const jsonwebtoken = require("jsonwebtoken");
const util = require("util");
const WeixinAuth = require("../lib/koa2-weixin-auth");
const WXBizDataCrypt = require("../lib/WXBizDataCrypt");
const config = require("../config");
const User = require("../models/user-model");
const SessionKey = require("../models/session-key-model");

// 再开启另一个路由，还可以有一个群组
const router = new Router({
  prefix: "/user",
});

// 错误处理，被koajwt挡住的请求
// 没有token或者token过期，则会返回401。
// 与下面的koajwt设置是组合使用的
router.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.status === 401) {
      ctx.status = 401;
      ctx.body = "Protected resource";
    } else {
      throw err;
    }
  }
});
// 如果没有验证通过，会返回404
router.use(
  koajwt({ secret: config.jwtSecret }).unless({
    // Logon interface does not require authentication
    path: [
      "/user/login",
      "/user/wexin-login1",
      "/user/wexin-login2",
      "/user/web-view",
    ],
  })
);

router.use(async (ctx, next) => {
  // console.log('ctx.url', ctx.url, ctx.url.includes('login'));
  // 如果不是登录页，
  // 还有web-view，这是为了测试方便
  if (!ctx.url.includes("login") && !ctx.url.includes("web-view")) {
    try {
      let token = ctx.request.header.authorization;
      console.log("token", token);
      token = token.split(" ")[1];
      // 如果签名不对，这里会报错，走到catch分支
      let payload = await util.promisify(jsonwebtoken.verify)(
        token,
        config.jwtSecret
      );
      console.log("payload", payload);
      let { openId, nickName, avatarUrl } = payload;
      ctx["user"] = { openId, nickName, avatarUrl };
      console.log("openId,nickName, avatarUrl", openId, nickName, avatarUrl);
      // 404 bug
      await next();
    } catch (err) {
      console.log("err", err);
      throw err;
    }
  } else {
    // 这里status状态不对，也会返回404
    // 所有next都要加await，重要！
    await next();
  }
});

// 登陆
router.get("/login", function (ctx) {
  let { user, password } = ctx.request.query;
  // console.log(user,password);

  // 省略查库过程，将验证过程硬编码
  if (user == "ly" && password == "ly") {
    ctx.status = 200;
    ctx.body = {
      code: 200,
      msg: "Login Successful",
      token:
        "Bearer " +
        jsonwebtoken.sign(
          { name: user }, // Encrypt userToken
          config.jwtSecret,
          { expiresIn: "1d" }
        ),
    };
  } else {
    ctx.status = 400;
    ctx.body = {
      code: 400,
      msg: "User name password mismatch",
    };
  }
});

// 测试jwt阻断，在小程序中也有调用，为了测试
router.all("/home", async function (ctx) {
  let name = ctx.request.query.name || "";
  // 取出并打印user对象
  let user = ctx.user;
  console.log("user", user);
  ctx.status = 200;
  ctx.body = {
    code: 200,
    msg: `ok,${name}`,
  };
});

// 一个web-view页面，是给小程序加载的
router.all("/web-view", async function (ctx) {
  let token = ctx.request.query.token;
  if (token)
    ctx.cookies.set("Authorization", `Bearer ${token}`, { httpOnly: false });
  let title = "web view from koa";
  await ctx.render("index2", {
    title,
    arr: [1, 2, 3],
    now: new Date(),
  });
});

// 小程序的机要信息
const weixinAuth = new WeixinAuth(
  config.miniProgram.appId,
  config.miniProgram.appSecret
);

// 这是第一次小程序登陆法
router.post("/wexin-login1", async (ctx) => {
  let { code } = ctx.request.body;

  const token = await weixinAuth.getAccessToken(code);
  // const accessToken = token.data.access_token;
  const openid = token.data.openid;

  // const userinfo = await weixinAuth.getUser(openid)
  // 这个地方有一个错误，invalid credential, access_token is invalid or not latest
  // 拉取不到userInfo

  ctx.status = 200;
  ctx.body = {
    code: 200,
    msg: "ok",
    data: openid,
  };
});

// 这是正规的登陆方法
// 添加一个参数，sessionKeyIsValid，代表sessionKey是否还有效
router.post("/wexin-login2", async (ctx) => {
  console.log("request.body", ctx.request.body);
  let { code, userInfo, encryptedData, iv, sessionKeyIsValid } =
    ctx.request.body;

  console.log("sessionKeyIsValid", sessionKeyIsValid);

  let sessionKey;
  // 如果客户端有token，则传来，解析
  if (sessionKeyIsValid) {
    let token = ctx.request.header.authorization;
    token = token.split(" ")[1];
    // token有可能是空的
    if (token) {
      let payload = await util
        .promisify(jsonwebtoken.verify)(token, config.jwtSecret)
        .catch((err) => {
          console.log("err", err);
        });
      console.log("payload", payload);
      if (payload) sessionKey = payload.sessionKey;
    }
  }
  // 除了尝试从token中获取sessionKey，还可以从数据库中或服务器redis缓存中获取
  // 如果在db或redis中存储，可以与cookie结合起来使用，
  // 目前没有这样做，sessionKey仍然存在丢失的时候，又缺少一个wx.clearSession方法
  if (sessionKeyIsValid && !sessionKey && ctx.session.sessionKeyRecordId) {
    // 如果还不有找到历史上有效的sessionKey，从db中取一下
    let sesskonKeyRecordOld = await SessionKey.findOne({
      where: {
        id: ctx.session.sessionKeyRecordId,
      },
    });
    if (sesskonKeyRecordOld) sessionKey = sesskonKeyRecordOld.sessionKey;
    console.log("从db中查找sessionKey3", sessionKey);
  }
  // 如果从token中没有取到，则从服务器上取一次
  if (!sessionKey) {
    const token = await weixinAuth.getAccessToken(code);
    // 目前微信的 session_key, 有效期3天
    sessionKey = token.data.session_key;
    console.log("sessionKey2", sessionKey);
  }

  let decryptedUserInfo;
  var pc = new WXBizDataCrypt(config.miniProgram.appId, sessionKey);
  // 有可能因为sessionKey不与code匹配，而出错
  // 通过错误，通知前端再重新拉取code
  decryptedUserInfo = pc.decryptData(encryptedData, iv);
  console.log("解密后 decryptedUserInfo.openId: ", decryptedUserInfo.openId);

  // 添加上openId与sessionKey
  let authorizationToken = jsonwebtoken.sign(
    {
      nickName: decryptedUserInfo.nickName,
      avatarUrl: decryptedUserInfo.avatarUrl,
      openId: decryptedUserInfo.openId,
      sessionKey: sessionKey,
    },
    config.jwtSecret,
    { expiresIn: "3d" } //修改为3天，这是sessionKey的有效时间
  );
  Object.assign(decryptedUserInfo, { authorizationToken });

  let user = await User.findOne({
    where: { openId: decryptedUserInfo.openId },
  });
  if (!user) {
    //如果用户没有查到，则创建
    let createRes = await User.create(decryptedUserInfo);
    console.log("createRes", createRes);
    if (createRes) user = createRes.dataValues;
  }
  let sessionKeyRecord = await SessionKey.findOne({ where: { uid: user.id } });
  if (sessionKeyRecord) {
    await sessionKeyRecord.update({
      sessionKey: sessionKey,
    });
  } else {
    let sessionKeyRecordCreateRes = await SessionKey.create({
      uid: user.id,
      sessionKey: sessionKey,
    });
    sessionKeyRecord = sessionKeyRecordCreateRes.dataValues;
    console.log("created record", sessionKeyRecord);
  }
  ctx.session.sessionKeyRecordId = sessionKeyRecord.id;

  ctx.status = 200;
  ctx.body = {
    code: 200,
    msg: "ok",
    data: decryptedUserInfo,
  };
});

module.exports = router;
