const path = require('path')
const px2rem = require('postcss-px2rem')   // postcss的一个插件

module.exports = {

  configureWebpack: {  //写webpack原生配置
    resolve: {
      extensions: ['.js', '.vue', '.json'], //可以省略的后缀名
      alias: { // 路径别名
        // 'vue$': 'vue/dist/vue.esm.js',  // 表示精准匹配，内部含有vue编译器
        '@': path.resolve(__dirname, 'src'),
        '@components': path.resolve(__dirname, 'src/components')
      }
    },
  },

  // runtimeCompiler: true,  //解析器，打开就可以使用template，但是我们一般不建议用这个，因为加上解析器会使文件变大
  lintOnSave: false, //关闭Eslint的规则
  css: {  // 添加postcss配置  vue脚手架定义的
    loaderOptions: {
      postcss: {
        plugins: [
          px2rem({
            remUnit: 37.5   //设计稿等分后的rem值375/10，这个值的大小由设计稿来定，有可能是375，也有可能是750，把这个数字除以10即可
          })
        ]
      }
    }
  },

  devServer: {
    host: '0.0.0.0',
    // 处理以/api开头的路径
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        pathRewrite: {
          '^/api': ''  //转发请求时去除路径前面的api
        },
        changeOrigin: true //支持跨域
      }
    }
  }
}