/* jshint node:true */
/* global $:false */
var phantom = require('phantom');

phantom.create(function(ph) {
    return ph.createPage(function(page) {
        return openPage(page, 'http://www.gapp.gov.cn/zongshu/serviceListcip.shtml?CIPNum=&ISBN=&Certificate=&PublishingUnit=&', 0);
    });
});
function openPage(page, url, startNum) {
    return page.open(url + 'startnum=' + startNum, function(status) {
        console.log("opened site? " , status);

        page.injectJs('http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', function() {
            setTimeout(function() {
                return page.evaluate(function() {
                    var h2Arr = [];

                    $('.trStyle tr').each(function(i) {
                        if (i > 0) {
                            var obj = {};
                            $(this).find('td').each(function(index) {
                                if (index === 2) {
                                    obj.bookname = $(this).html();
                                } else if (index === 3) {
                                    obj.author = $(this).html();
                                } else if (index === 4) {
                                    obj.publisher = $(this).html();
                                }
                            });
                            h2Arr.push(obj);
                        }
                    });
                    return h2Arr;
                }, function(result) {
                    console.log(result);
                    openPage(page, url, startNum + 20);
                });
            }, 5000);
        });
    });
}
