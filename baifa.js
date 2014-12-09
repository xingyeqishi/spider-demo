/* jshint node:true */
/* global $:false */
var phantom = require('phantom');
var colors = require('colors');
var urlArr = [
    {name: '百发100', url:'http://www.baidu.com/s?wd=%E7%99%BE%E5%8F%91100%E6%8C%87%E6%95%B0'},
    {name: '上证指数', url:'http://www.baidu.com/s?wd=%E4%B8%8A%E8%AF%81%E6%8C%87%E6%95%B0'},
    {name: '深圳成指', url:'http://www.baidu.com/s?wd=%E6%B7%B1%E5%9C%B3%E6%88%90%E6%8C%87'},
    {name: '创业板指数', url:'http://www.baidu.com/s?wd=%E5%88%9B%E4%B8%9A%E6%9D%BF%E6%8C%87%E6%95%B0'}
];
var i = 0;

phantom.create(function(ph) {
    return ph.createPage(function(page) {
        return openPage(page, urlArr[i], ph);
    });
});
function openPage(page, obj, ph) {
    return page.open(obj.url, function() {
        i++;

        page.injectJs('http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', function() {
                return page.evaluate(function() {
                    return $('.op-stockdynamic-cur .op-stockdynamic-cur-info').html().split(' ')[1].replace(/[()]/g, '');
                }, function(result) {
                    if (result.indexOf('-') !== -1) {
                        console.log(colors.green(obj.name + ': '+ result));
                    } else {
                        console.log(colors.red(obj.name + ': '+ result));
                    }
                    if (i < urlArr.length) {
                        openPage(page, urlArr[i], ph);
                    } else {
                        ph.exit();
                    }
                });
            }
        );
    });
}
