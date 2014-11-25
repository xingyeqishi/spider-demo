/* jshint node:true */
var request = require("request");
var cheerio = require("cheerio");

var j = request.jar();
var cookie = request.cookie('key1=value1');
var url = 'http://www.dianping.com/search/category/2/10/g110';
j.setCookie(cookie, url);
var i = 1;
start();
function start() {
    //前300页
    if (i < 300) {
        console.log('********' + url + 'p' + i + '**************');
        scratchData(url + 'p' + i, function() {
            i++;
            start();
        });
    }
}
function scratchData(url, callback) {
    request({
        method: 'GET',
        url: url,
        jar: j,
        headers: {
            'User-Agent': 'request'
        }
    }, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var $ = cheerio.load(body);
            $('.shop-list li .tit a h4').each(function () {
                console.log('%s ', $(this).text());
            });
            if (callback) {
                callback();
            }
        }
    });
}
