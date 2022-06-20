const Koa = require("koa");
const middleware = require("./middleware");
const routers = require("./routers");
const initDb = require("./models/init-db")

const app = new Koa();
middleware(app);
routers(app);
initDb();

// 服务启动
app.listen(30000);

/*
在终端中测试jwt阻断的脚本
curl -X GET -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibHkiLCJpYXQiOjE1OTEyMTMxNTksImV4cCI6MTU5MTIxNjc1OX0.SOU3xdOdFLcrJ0Y9KIeBGRXYXGmqYUOIhbrh_dnOh3s" "http://localhost:3000/user/home"
*/
