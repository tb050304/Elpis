const path = require("path");
const { sep } = path;
/**
 * config loader
 * @params {object} app koa实例
 *
 * 配置区分 本地/测试/生产，通过env环境读取不同文件配置 env.config
 * 通过env.config覆盖default.config加载到app.config中
 * 目录下对应的config配置
 * 默认配置config/config.default.js
 * 本地配置config/config.local.js
 * 测试配置config/config.beta.js
 * 生产配置config/config.prod.js
 */
module.exports = (app) => {
  //找到config/目录
  const configPath = path.resolve(app.baseDir, `.${sep}config`);
  //获取default.config
  let defaultConfig = {};
  try {
    defaultConfig = require(
      path.resolve(configPath, `.${sep}config.default.js`),
    );
  } catch (e) {
    console.log("[exception] there is no default.config file");
  }

  //获取env.config
  let envConfig = {};
  try {
    if (app.env.isLocal()) {
      //本地环境
      envConfig = require(path.resolve(configPath, `.${sep}config.local.js`));
    } else if (app.env.isBeta()) {
      //测试环境
      envConfig = require(path.resolve(configPath, `.${sep}config.beta.js`));
    } else if (app.env.isProduction()) {
      //生产环境
      envConfig = require(path.resolve(configPath, `.${sep}config.prod.js`));
    }
  } catch (e) {
    console.log("[exception] there is no env.config file");
  }
  //覆盖并加载config配置
  app.config = Object.assign({}, defaultConfig, envConfig);
};
