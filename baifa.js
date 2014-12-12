/* jshint node:true */
/* global $:false */
var phantom = require('phantom');
var colors = require('colors');
var urlArr = require('./config.json');
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
                    if (typeof $!== 'undefined' && $('.op-stockdynamic-cur')) {
                        return $('.op-stockdynamic-cur .op-stockdynamic-cur-info').html().split(' ')[1].replace(/[()]/g, '');
                    // 天天基金网
                    } else {
                        var str = document.body.innerHTML;
                        var reg = /jsonp\(([\s\S]+?)\)/g;
                        var data = JSON.parse(reg.exec(str)[1]);
                        /*
                        if (data.gsz >= data.dwjz) {
                            return '+' + data.gszzl;
                        } else {
                            return '-' + data.gszzl;
                        }
                        */
                        return data.gszzl;
                    }
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
