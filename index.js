const Koa = require("koa");

//koa实例
const app = new Koa();

//启动服务
try {
  const port = process.env.PORT || 8082;
  const host = process.env.IP || "0.0.0.0";
  app.listen(port, host);
  console.log(`Server running on port:${port}`);
} catch (e) {
  console.error(e);
}
