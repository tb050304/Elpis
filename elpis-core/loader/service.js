const glob = require("glob");
const path = require("path");
const { sep } = path;
/**
 * service loader
 * @param {object} app Koa 实例
 * 加载所有service,可通过'app..${文件}'访问
 * 例如：
 * app/service
 * |
 * |--custom-module
 *         |
 *         | -- custom-service.js
 *
 * =>app.services.customModule.customservice
 *
 */

module.exports = (app) => {
  //读取 app/service/**/**.js下所有的文件
  const servicePath = path.resolve(app.businessPath, `.${sep}service`);
  const fileList = glob.sync(path.resolve(servicePath, `.${sep}**${sep}**.js`));

  //遍历所有文件目录，把内容加载到app.service下
  const service = {};
  fileList.forEach((file) => {
    //提取文件名称
    let name = path.resolve(file);

    //截取路径app/services/custom-module/custom-service=>custom-module/custom-service
    name = name.substring(
      name.lastIndexOf(`service${sep}`) + `service${sep}`.length,
      name.lastIndexOf(".")
    );

    //把'-'统一改为驼峰式,custom-module/custom-service.js=>customModule.customService
    name = name.replace(/[_-][a-z]/gi, (s) => s.substring(1).toUpperCase());

    //挂载service到内存app对象中
    let tempService = service;
    const names = name.split(sep);
    for (let i = 0, len = names.length; i < len; ++i) {
      if (i === len - 1) {
        const serviceModule = require(path.resolve(file))(app);
        tempService[name[i]] = new serviceModule();
      } else {
        if (!tempService[names[i]]) {
          tempService[names[i]] = {};
        }
        tempService = tempService[names[i]];
      }
    }
  });
  app.service = service;
};
