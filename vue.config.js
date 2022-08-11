/**
 * vue生产配置
 */
const { defineConfig } = require('@vue/cli-service')
/**
 * 引入Polyfill插件让项目可以使用Nodejs的crypto和buffer模块
 */
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
module.exports = defineConfig({
  /**
   * 使用Polyfill插件
   */
  configureWebpack: {
    plugins: [
      new NodePolyfillPlugin()
    ]
  },
  transpileDependencies: true,
  /**
   * 页面清单
   */
  pages: {
    popup: {
      /**入口文件 */
      entry: './src/popup_main.js',
      /**模板文件 */
      template: './public/popup.html',
      /**生成的文件名 */
      filename: 'popup.html'
    },
    tab: {
      entry: './src/tab_main.js',
      template: './public/tab.html',
      filename: 'tab.html'
    },
    option: {
      entry: './src/option_main.js',
      template: './public/option.html',
      filename: 'option.html'
    }
  }
})
