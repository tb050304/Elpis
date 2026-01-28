const glob = require("glob");
const path = require("path");
const { sep } = path;
/**
 * router-schema loader
 * @param {object} app koa 实例
 * 通过'json-schema & ajv'对 API 规则进行约束，配合api-params-verigy 中间件使用
 *
 * app/routerSchema/**.js
 *
 * 输出：
 * app.routerSchema={
 *  '${api1}':${jsonSchema},
 *  '${api2}':${jsonSchema},
 *  '${api3}':${jsonSchema},
 *  '${api4}':${jsonSchema},
 * }
 *
 */
module.exports = (app) => {
  //读取 app/router-schema/**/**.js下所有的文件
  const routerSchemaPath = path.resolve(
    app.businessPath,
    `.${sep}router-schema`
  );
  const fileList = glob.sync(
    path.resolve(routerSchemaPath, `.${sep}**${sep}**.js`)
  );
  //注册所有routerSchema,使得可以'app.routerSchema'这样访问
  let routerSchema = {};

  fileList.forEach((file) => {
    routerSchema = {
      ...routerSchema,
      ...require(path.resolve(file)),
    };
  });

  app.routerSchema = routerSchema;
};
