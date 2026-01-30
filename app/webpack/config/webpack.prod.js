const path = require("path");
const merge = require("webpack-merge");
const os = require("os");
const HappyPack = require("happypack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CSSMinizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackInjectAttributesPlugin = require("html-webpack-inject-attributes-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

//多线程build设置
const happypackCommonConfig = {
  debug: false,
  threadPool: HappyPack.ThreadPool({ size: os.cpus().length }),
};
//基类配置
const baseConfig = require("./webpack.base.js");
// const plugin = require("eslint-plugin-import");
// const HtmlWebpackInjectAttributesPlugin = require("html-webpack-inject-attributes-plugin");

//生产环境webpack配置
const webpackConfig = merge.smart(baseConfig, {
  //指定生产环境
  mode: "production",

  //生产环境的output配置
  output: {
    filename: "js/[name]_[chunkhash:8].bundle.js",
    path: path.join(process.cwd(), "./app/public/dist/prod/"),
    publicPath: "/dist/prod/",
    crossOriginLoading: "anonymous",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "happypack/loader?id=css"],
      },
      {
        test: /\.js$/,
        include: [
          //只对业务代码进行babel，加快webpack打包速度
          path.resolve(process.cwd(), "./app/pages"),
        ],
        use: ["happypack/loader?id=js"],
      },
    ],
  },
  //webpack不会有大量hints信息，默认为warning
  performance: {
    hints: false,
  },
  plugins: [
    //每次build前，清空public/dist目录
    new CleanWebpackPlugin(["public/dist"], {
      root: path.resolve(process.cwd(), "./app/"),
      exclude: [],
      verbose: true,
      dry: false,
    }),
    //提取公共css的公共部分，有效利用缓存
    new MiniCssExtractPlugin({
      chunkFilename: "css/[name]_[contenthash:8].bundle.css",
    }),

    //优化并压缩css资源
    new CSSMinizerPlugin(),
    //多线程打包JS，加快打包速度
    new HappyPack({
      ...happypackCommonConfig,
      id: "js",
      loaders: [
        `babel-loader?${JSON.stringify({
          presets: ["@babel/preset-env"],
          plugins: ["@babel/plugin-transform-runtime"],
        })}`,
      ],
    }),
    //多线程打包CSS，加快打包速度
    new HappyPack({
      ...happypackCommonConfig,
      id: "css",
      loaders: [
        {
          path: "css-loader",
          options: {
            importLoaders: 1,
          },
        },
      ],
    }),
    //浏览器在请求资源时不发送用户的身份凭证
    new HtmlWebpackInjectAttributesPlugin({
      crossorigin: "anonymous",
    }),
  ],
  optimization: {
    //使用TerserWebpackPlugin的并发和缓存，提升压缩阶段的性能
    //清除 console.log
    minimize: true,
    minimizer: [
      new TerserWebpackPlugin({
        // cache: true, //启用缓存来加速构建过程
        parallel: true, //利用多核CPU的优势来加快压缩速度
        terserOptions: {
          compress: {
            drop_console: true, //去掉console.log内容
          },
        },
      }),
    ],
  },
});

module.exports = webpackConfig;
