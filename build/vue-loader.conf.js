var fs = require('fs')
var path = require('path');
var utils = require('./utils');
var config = require('../config');
var isProduction = process.env.NODE_ENV === 'production';

let vueLoaderConfig = {
    loaders: utils.cssLoaders({
        sourceMap: isProduction
            ? config.build.productionSourceMap
            : config.dev.cssSourceMap,
        extract: isProduction
    })
};

if (fs.existsSync(path.join(__dirname, '..', 'node_modules/muse-ui/'))) {
    console.log('muse-ui exists');

    const museUiThemePath = path.join(
        __dirname,
        '../node_modules',
        'muse-ui',
        'src/styles/themes/variables/light.less'
    );

    var temp = vueLoaderConfig.loaders.less;
    temp.forEach((item, index) => {
        if (item.loader === 'less-loader') {
            if (!temp[index].options) {
                temp[index].options = {};
            }
            temp[index].options.globalVars = {
                museUiTheme: `'${museUiThemePath}'`,
            }
        }
    });
}

module.exports = vueLoaderConfig;
