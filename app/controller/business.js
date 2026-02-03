module.exports = (app) => {
  const baseController = require("./base")(app);
  return class BusinessController extends baseController {
    remove(ctx) {
      const { product_id: productId } = ctx.request.body;
      this.success(ctx, {
        projKey: ctx.projKey,
        product_id: productId,
      });
    }

    getList(ctx) {
      const { page, size } = ctx.request.query;

      //获取 proj_key
      //根据不同的 proj_key 做不一样的数据提取

      this.success(
        ctx,
        [
          {
            product_id: "1",
            product_name: `${ctx.projKey} - 《大前端面试宝典》`,
            price: 39.9,
            inventory: 99999,
            create_time: "2023-07-03 20:23:22",
          },
          {
            product_id: "2",
            product_name: `${ctx.projKey} - 《前端求职之道》`,
            price: 199,
            inventory: 1000000,
            create_time: "2023-02-14 20:23:22",
          },
          {
            product_id: "3",
            product_name: `${ctx.projKey} - 《大前端全栈实践》`,
            price: 899,
            inventory: 18888,
            create_time: "2024-11-17 11:02:01",
          },
        ],
        {
          total: 3,
          page,
          size,
        },
      );
    }
  };
};
