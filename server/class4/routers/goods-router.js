const Router = require("@koa/router");
const GoodsCatetory = require("../models/goods-category-model");

const router = new Router({
  prefix: "/goods",
});

router.get("/categories", async function (ctx) {
  let categories = await GoodsCatetory.findAll({
    attributes: ["id", "category_name"],
  });
  ctx.status = 200;
  ctx.body = {
    coce: 200,
    msg: "ok",
    data: categories,
  };
});

module.exports = router;
