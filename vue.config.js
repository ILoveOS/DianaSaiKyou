const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pages:{
    popup:{
      entry:'./src/popup_main.js',
      template:'./public/popup.html',
      filename:'popup.html'
    },
    tab:{
      entry:'./src/tab_main.js',
      template:'./public/tab.html',
      filename:'tab.html'
    },
    option:{
      entry:'./src/option_main.js',
      template:'./public/option.html',
      filename:'option.html'
    }
  }
})
