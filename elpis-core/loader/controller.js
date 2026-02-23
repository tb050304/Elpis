const glob = require("glob");
const path = require("path");
const { sep } = path;
/**
 * controller loader
 * @param {object} app Koa 实例
 * 加载所有controller,可通过'app..${文件}'访问
 * 例如：
 * app/controller
 * |
 * |--custom-module
 *         |
 *         | -- custom-controller.js
 *
 * =>app.controller.customModule.customController
 *
 */

module.exports = (app) => {
  const controller = {};
  //读取 elpis/app/controller/**/**.js下所有的文件
  const elpisControllerPath = path.resolve(
    __dirname,
    `..${sep}..${sep}app${sep}controller`,
  );
  const elpisFileList = glob.sync(
    path.resolve(elpisControllerPath, `.${sep}**${sep}**.js`),
  );
  elpisFileList.forEach((file) => {
    handleFile(file);
  });
  //读取 业务/app/controller/**/**.js下所有的文件
  const businessControllerPath = path.resolve(
    app.businessPath,
    `.${sep}controller`,
  );
  const businessFileList = glob.sync(
    path.resolve(businessControllerPath, `.${sep}**${sep}**.js`),
  );
  businessFileList.forEach((file) => {
    handleFile(file);
  });

  //把内容加载到app.controller下
  function handleFile(file) {
    //提取文件名称
    let name = path.resolve(file);

    //截取路径app/controllers/custom-module/custom-controller=>custom-module/custom-controller
    name = name.substring(
      name.lastIndexOf(`controller${sep}`) + `controller${sep}`.length,
      name.lastIndexOf("."),
    );

    //把'-'统一改为驼峰式,custom-module/custom-controller.js=>customModule.customcontroller
    name = name.replace(/[_-][a-z]/gi, (s) => s.substring(1).toUpperCase());

    //挂载controller到内存app对象中
    let tempController = controller;
    const names = name.split(sep);
    for (let i = 0, len = names.length; i < len; ++i) {
      if (i === len - 1) {
        const ControllerModule = require(path.resolve(file))(app);
        tempController[names[i]] = new ControllerModule();
      } else {
        if (!tempController[names[i]]) {
          tempController[names[i]] = {};
        }
        tempController = tempController[names[i]];
      }
    }
  }
  app.controller = controller;
};
