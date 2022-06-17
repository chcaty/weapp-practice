const Koa = require('koa');
const session = require('koa-session')
const store = require('koa-session-local');

const Router = require("@koa/router")
const koajwt = require('koa-jwt');
const jsonwebtoken = require('jsonwebtoken');
const util = require('util');
const logger = require('koa-logger')
const WeixinAuth = require("./koa2-weixin-auth");
const koaBody = require('koa-body');
const WXBizDataCrypt = require('./WXBizDataCrypt')
const views = require('koa-views')
const path = require('path')
const serve = require('koa-static-server')

const app = new Koa();
app.use(logger())
app.use(koaBody());//parse request.body
// 静态文件，自动跳过koajwt检测了
app.use(serve({rootDir: 'static', rootPath: '/static'}))


// 加载模板引擎
app.use(views(path.join(__dirname, './views'), {
    extension: 'ejs'
  }))

// log
app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`执行时间：${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time
app.use(async (ctx, next) => {
    const start = Date.now();
    console.log('记录开始时间');
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});

// 设置签名的 Cookie 密钥
app.keys = ['koakeys'];
// session
// cookie中设置了HttpOnly属性,那么通过js脚本将无法读取到cookie信息
// signed = false 时，app.keys 不赋值没有关系；如果 signed: true 时，则需要对 app.keys 赋值，否则会报错。
const CONFIG = {
    store: new store(),
    key: 'koa.sess', /** (string) cookie key (default is koa.sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    autoCommit: true, /** (boolean) automatically commit headers (default true) */
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
    secure: false, /** (boolean) secure cookie*/
    sameSite: null, /** (string) session cookie sameSite options (default null, don't set it) */
};
// Error: Cannot send secure cookie over unencrypted connection
// 将 secure 改为false，在本地测试

app.use(session(CONFIG, app));

// Cannot set headers after they are sent to the client

// cookie
app.use(async function (ctx, next) {
    const n = ~~ctx.cookies.get('view') + 1;
    ctx.cookies.set('view', n, {httpOnly:false});
    // 中间件调用next要加await,否则报错404
    await next();
});

// use session


// 开放一个路由
const defaultRouter = new Router()
// 这是一个中间件
defaultRouter.use(async (ctx,next) => {
    let n = ~~ctx.session.views +1;
    ctx.session.views = n;
    console.log('views'+n)
    await next()
});
defaultRouter.get('/', function (ctx) {
    let n = ~~ctx.session.views + 1;
    ctx.session.views = n;
    ctx.body = 'views' + n;
});
defaultRouter.get('/hi', function (ctx) {
  ctx.body = `hi,Request Body: ${JSON.stringify(ctx.request.body)}`;
  console.log('hi输出完毕');
});
app.use(defaultRouter.routes()).use(defaultRouter.allowedMethods());

// jwt 实现

const JWT_SECRET = 'JWTSECRET'

// 错误处理，被koajwt挡住的请求
// 没有token或者token过期，则会返回401。
// 与下面的koajwt设置是组合使用的
app.use(async (ctx, next) => {
    try {
        await next()
    } catch (err) {
        if(err.status === 401){
          ctx.status = 401;
      		ctx.body = 'Protected resource';
        }else{
            throw err;
        }
    }
})
// 如果没有验证通过，会返回404   
app.use(koajwt({ secret: JWT_SECRET }).unless({
    // Logon interface does not require authentication
    path: ['/user/login', '/user/wexin-login1', '/user/wexin-login2', '/user/web-view']
}));

// 再开启另一个路由，还可以有一个群组
const router = new Router({
    prefix: '/user'
});
router.use(async (ctx, next) => {
    // console.log('ctx.url', ctx.url, ctx.url.includes('login'));
    // 如果不是登录页，
    // 还有web-view，这是为了测试方便
    if (!ctx.url.includes('login') && !ctx.url.includes('web-view')) {
        try {
            let token = ctx.request.header.authorization;
            console.log('token', token);
            token = token.split(' ')[1]
            // 如果签名不对，这里会报错，走到catch分支
            let payload = await util.promisify(jsonwebtoken.verify)(token, JWT_SECRET);
            console.log('payload', payload);
            // 404 bug
            await next()
        } catch (err) {
            console.log('err', err);
            throw err;
        }
    } else {
        // 这里status状态不对，也会返回404
        // 所有next都要加await，重要！
        await next()
    }
})

// 登陆
router.get('/login', function (ctx) {
    let {user,password} = ctx.request.query
    // console.log(user,password);
    
    // 省略查库过程，将验证过程硬编码
    if (user == 'ly' &&  password == 'ly') {
        ctx.status = 200
        ctx.body = {
            code: 200,
            msg: 'Login Successful',
            token: "Bearer " + jsonwebtoken.sign(
                { name: user },  // Encrypt userToken
                JWT_SECRET,
                { expiresIn: '1d' }
            )
        }
    } else {
        ctx.status = 400
        ctx.body = {
            code: 400,
            msg: 'User name password mismatch'
        }
    }
});

// 测试jwt阻断，在小程序中也有调用，为了测试
router.all('/home', async function (ctx) {
    let name = ctx.request.query.name || ''
    ctx.status = 200;
    ctx.body = {
        code: 200,
        msg: `ok,${name}`
    }
});

// 一个web-view页面，是给小程序加载的
router.all('/web-view', async function (ctx) {
    let token = ctx.request.query.token 
    if (token) ctx.cookies.set('Authorization', `Bearer ${token}`, {httpOnly:false});
    let title = 'web view from koa'
    await ctx.render('index', {
        title,
    })
});

// 小程序的机要信息
const miniProgramAppId = 'wx06fa4c619b9835ff'
const miniProgramAppSecret = '220879499d4896b76d23a7c6bd8724de'
const weixinAuth = new WeixinAuth(miniProgramAppId, miniProgramAppSecret);

// 这是第一次小程序登陆法
router.post("/wexin-login1", async (ctx) => {
    let { code } = ctx.request.body

    const token = await weixinAuth.getAccessToken(code);
    // const accessToken = token.data.access_token;
    const openid = token.data.openid;

    // const userinfo = await weixinAuth.getUser(openid)
    // 这个地方有一个错误，invalid credential, access_token is invalid or not latest
    // 拉取不到userInfo

    ctx.status = 200
    ctx.body = {
        code: 200,
        msg: 'ok',
        data: openid
    }
})

// 这是正规的登陆方法
router.post("/wexin-login2", async (ctx) => {
    console.log('request.body',ctx.request.body);
    let { code,
        userInfo,
        encryptedData,
        iv } = ctx.request.body

    const token = await weixinAuth.getAccessToken(code);
    const sessionKey = token.data.session_key;
    console.log('sessionKey',sessionKey);

    var pc = new WXBizDataCrypt(miniProgramAppId, sessionKey)
    var decryptedUserInfo = pc.decryptData(encryptedData, iv)
    console.log('解密后 decryptedUserInfo.openId: ', decryptedUserInfo.openId)

    let authorizationToken = jsonwebtoken.sign(
        { name: decryptedUserInfo.nickName }, 
        JWT_SECRET,
        { expiresIn: '1d' }
    )
    Object.assign(decryptedUserInfo, {authorizationToken})

    ctx.status = 200
    ctx.body = {
        code: 200,
        msg: 'ok',
        data: decryptedUserInfo
    }
})

// 启用这个路由
app.use(router.routes())
app.use(router.allowedMethods());

// 服务启动
app.listen(30000);

/*
在终端中测试jwt阻断的脚本
curl -X GET -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibHkiLCJpYXQiOjE1OTEyMTMxNTksImV4cCI6MTU5MTIxNjc1OX0.SOU3xdOdFLcrJ0Y9KIeBGRXYXGmqYUOIhbrh_dnOh3s" "http://localhost:3000/user/home"
*/
