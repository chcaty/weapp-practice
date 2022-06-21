const Router = require("@koa/router");
const GoodsCatetory = require("../models/goods-category-model");
const Goods = require("../models/goods-model");
const GoodsInfo = require("../models/goods-info-model");

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

router.get("/goods", async function (ctx) {
  let whereObj = {};
  let page_size = 20,
    page_index = 1;
  if (ctx.query.page_size) page_size = Number(ctx.query.page_size);
  if (ctx.query.page_index) page_index = Number(ctx.query.page_index);
  if (ctx.query.category_id)
    whereObj.category_id = Number(ctx.query.category_id);

  Goods.hasMany(GoodsInfo, { foreignKey: "goods_id", targetKey: "id" });

  let goods = await Goods.findAndCountAll({
    where: whereObj,
    order: [["id", "desc"]],
    limit: page_size,
    offset: (page_index - 1) * page_size,
    include: [
      {
        model: GoodsInfo,
        attributes: ["content", "kind", "goods_id"],
        where: { 'kind': 0 },
      },
    ],
  });
  ctx.status = 200;
  ctx.body = {
    coce: 200,
    msg: "ok",
    data: goods,
  };
});

module.exports = router;
