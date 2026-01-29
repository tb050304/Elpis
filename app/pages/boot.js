import { createApp } from "vue";

//引入elementUI
import ElementUI from "element-plus";
import "element-plus/theme-chalk/index.css";

import "./asserts/custom.css";

import pinia from "$store";

import { createRouter, createWebHashHistory } from "vue-router";

/**
 * vue页面主入口，用于启动vue
 * @params pageComponent vue入口组件
 * @params routes 路由列表
 * @params libs 页面第三方依赖包
 */
export default (pageComponent, { routes, libs } = {}) => {
  const app = createApp(pageComponent);
  //应用ElementUI
  app.use(ElementUI);

  //引入pinia
  app.use(pinia);

  //引入第三方包
  if (libs && libs.length) {
    for (let i = 0; i < libs.length; i++) {
      app.use(libs[i]);
    }
  }

  //页面路由
  if (routes && routes.length) {
    const router = createRouter({
      history: createWebHashHistory(), //采用hash模式
      routes,
    });
    app.use(router);
    router.isReady().then(() => {
      app.mount("#root");
    });
  } else {
    app.mount("#root");
  }
};
