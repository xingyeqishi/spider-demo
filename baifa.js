/* jshint node:true */
/* global $:false */
var phantom = require('phantom');
var colors = require('colors');
var urlArr = require('./config.json');
var i = 0;
var debug = false;
var argArr = process.argv.slice(2);

if (argArr.indexOf('--debug') !== -1) {
    debug = true;
}

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
                    if (typeof $!== 'undefined' && $('.op-stockdynamic-moretab-cur-num')) {
                        //return $('.op-stockdynamic-cur .op-stockdynamic-cur-info').html().split(' ')[1].replace(/[()]/g, '') + '  ' + $('.op-stockdynamic-cur-num').html();
                        return $(".op-stockdynamic-moretab-cur-info").html().split(' ')[1].replace(/[()]/g, '') + '  ' + $(".op-stockdynamic-moretab-cur-num").html();
                    // 天天基金网
                    } else {
                        var str = document.body.innerHTML;
                        var reg = /jsonp\(([\s\S]+?)\)/g;
                        var data = JSON.parse(reg.exec(str)[1]);
                        if (data.gsz >= data.dwjz) {
                            return '+' + data.gszzl +'%' + '  ' + data.gsz;
                        } else {
                            return data.gszzl +'%' + '  ' + data.gsz;
                        }
                    }
                }, function(result) {
                    if (result.indexOf('-') !== -1) {
                        if (debug) {
                            console.log(obj.name + result);
                        } else {
                            console.log(obj.name + result .green);
                        }
                    } else {
                        if (debug) {
                            console.log(obj.name + result);
                        } else {
                            console.log(obj.name + result .red);
                        }
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
