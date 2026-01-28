module.exports = (app, router) => {
  const { view: ViewController } = app.controller;

  //用户输入http://ip:port/view/xxxx能渲染出对应的页面
  router.get("/view/:page", ViewController.renderPage.bind(ViewController));
};
