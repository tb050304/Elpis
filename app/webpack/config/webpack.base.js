const glob = require("glob");
const path = require("path");
const webpack = require("webpack");
const { VueLoaderPlugin } = require("vue-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const { template } = require("lodash");
// const { runtime } = require("webpack");

//动态构造pageEntries htmlWebpackPluginList
const pageEntries = {};
const htmlWebpackPluginList = [];

//获取app/pages目录下所有入口文件（entry.xxx.js）
const entryList = path.resolve(process.cwd(), "./app/pages/**/entry.*.js");
glob.sync(entryList).forEach((file) => {
  const entryName = path.basename(file, ".js");
  //构造entry
  pageEntries[entryName] = file;
  //构造最终渲染的页面文件
  htmlWebpackPluginList.push(
    //html-webpack-plugin 辅助注入打包后的 bundle文件到tpl文件中
    new HtmlWebpackPlugin({
      //产物（最终模板）输出路径
      filename: path.resolve(
        process.cwd(),
        "./app/public/dist/",
        `${entryName}.tpl`,
      ),
      //指定要使用的模板文件
      template: path.resolve(process.cwd(), "./app/view/entry.tpl"),
      //要注入的代码块
      chunks: [entryName],
    }),
  );
});
/**
 * webpack 基础配置
 */

module.exports = {
  //入口配置
  entry: pageEntries,
  //模块解析配置（决定了要加载解析哪些模块以及用什么方式去解释）
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: {
          loader: "vue-loader",
        },
      },
      {
        test: /\.js$/,
        include: [
          //只对业务代码进行babel，加快webpack打包速度
          path.resolve(process.cwd(), "./app/pages"),
        ],
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(png|jpe?g|gif)(\?.+)?$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 300,
            esModule: false,
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        use: ["file-loader"],
      },
    ],
  },
  //产物输出路径，因为开发和生产环境输出不一致，所以在各自环境中自行配置
  output: {},
  //配置模块解析的具体行为（定义webpack在打包时，如何找到并解析具体模块的路径）
  resolve: {
    extensions: [".js", ".vue", ".less", ".cess"],
    alias: {
      $pages: path.resolve(process.cwd(), "./app/pages"),
      $common: path.resolve(process.cwd(), "./app/pages/common"),
      $widgets: path.resolve(process.cwd(), "./app/pages/widgets"),
      $store: path.resolve(process.cwd(), "./app/pages/store"),
    },
  },
  //配置webpack插件
  plugins: [
    //处理.vue文件，这个插件是必须的
    //它的职能是将你定义过的其他规则复制并应用到.vue文件里
    //例如，如果有一条匹配规则/\.js$/的规则，那么它会应用到.vue文件中的<script>板块中
    new VueLoaderPlugin(),
    //把第三方库暴露到window context下
    new webpack.ProvidePlugin({
      Vue: "vue",
      axios: "axios",
      _: "lodash",
    }),
    //定义全局常量
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: "true", //支持vue解析optionsApi
      __VUE_PROD_DEVTOOLS__: "false", //禁用Vue调试工具
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "false", //禁用生产环境显示“水合”信息
    }),
    //构造最终渲染的页面模板
    ...htmlWebpackPluginList,
  ],
  //配置打包输出优化（代码分割，模块合并，缓存，TreeShaing，压缩等优化策略）
  optimization: {
    /**
     * 把js文件打包成3种类型
     * 1.vendor:第三方lib库，基本不会改动，除非依赖版本升级
     * 2.common:业务组件代码的公共部分抽取出来，改动较少
     * 3.entry.{page}:不同页面entry里的业务组件代码的差异部分，会经常改动
     * 目的：把改动和引用频率不一样的js区分出来，以达到更好利用浏览器缓存的效果
     */
    splitChunks: {
      chunks: "all", //对同步和异步模块都进行分割
      maxAsyncRequests: 10, //每次异步加载的最大并行请求数
      maxInitialRequests: 10, //入口点的最大并行请求数
      cacheGroups: {
        vendor: {
          //第三方依赖库
          test: /[\\/]node_modules[\\/]/, //打包node_module中的文件
          name: "vendor",
          priority: 20, //优先级，数字越大，优先级越高
          enforce: true, //强制执行
          reuseExistingChunk: true, //复用已有的公共chunk
        },
        common: {
          //公共模块
          test: /[\\/]common|wdigets[\\/]/,
          name: "common", //模块名称
          minChunks: 2, //被两处引用即被归为公共模块
          minSize: 1, //最小分割文件大小（1 byte）
          priority: 10, //优先级
          reuseExistingChunk: true, //复用已有的公共chunk
        },
      },
    },
    //将webpack运行时生成的代码打包到runtime.js
    runtimeChunk: true,
  },
};
