const glob = require("glob");
const path = require("path");
const { sep } = path;
/**
 * middleware loader
 * @param {object} app Koa 实例
 * 加载所有middleware,可通过'app.middleware.${文件}'访问
 * 例如：
 * app/middleware
 * |
 * |--custom-module
 *         |
 *         | -- custom-middleware.js
 *
 * =>app.middlewares.customModule.customMiddleware
 *
 */

module.exports = (app) => {
  //读取 app/middleware/**/**.js下所有的文件
  const middlewarePath = path.resolve(app.businessPath, `.${sep}middleware`);
  const fileList = glob.sync(
    path.resolve(middlewarePath, `.${sep}**${sep}**.js`)
  );

  //遍历所有文件目录，把内容加载到app.middlewares下
  const middlewares = {};
  fileList.forEach((file) => {
    //提取文件名称
    let name = path.resolve(file);

    //截取路径app/middlewares/custom-module/custom-middleware=>custom-module/custom-middleware
    name = name.substring(
      name.lastIndexOf(`middleware${sep}`) + `middleware${sep}`.length,
      name.lastIndexOf(".")
    );

    //把'-'统一改为驼峰式,custom-module/custom-middleware.js=>customModule.customMiddleware
    name = name.replace(/[_-][a-z]/gi, (s) => s.substring(1).toUpperCase());

    //挂载middlerware到内存app对象中
    let tempMiddleware = middlewares;
    const names = name.split(sep);
    for (let i = 0, len = names.length; i < len; ++i) {
      if (i === len - 1) {
        tempMiddleware[names[i]] = require(path.resolve(file))(app);
      } else {
        if (!tempMiddleware[names[i]]) {
          tempMiddleware[names[i]] = {};
        }
        tempMiddleware = tempMiddleware[names[i]];
      }
    }
  });
  app.middlewares = middlewares;
};
