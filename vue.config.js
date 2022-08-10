const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin=require('node-polyfill-webpack-plugin')
module.exports = defineConfig({
  configureWebpack: {
    plugins:[
      new NodePolyfillPlugin()
    ]
  },
  transpileDependencies: true,
  pages: {
    popup: {
      entry: './src/popup_main.js',
      template: './public/popup.html',
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
