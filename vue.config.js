const webpack = require('webpack')

module.exports={
    lintOnSave : false,
    // 这是一个函数，接收一个基于webpack-chain的config实例
    // 允许对内部的webpack配置进行更细粒度的配置
    chainWebpack:config=>{
        config.plugin('provide').use(webpack.ProvidePlugin,[{
            $:'jquery',
            jquery:'jquery',
            jQuery:'jquery',
            'winow.jQuery':'jquery'
        }])
    },
    devServer : {
      port : 8080,
    }
}
