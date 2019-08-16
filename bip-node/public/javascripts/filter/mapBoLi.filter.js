'use strict';
angular.module('myApp')
    .filter('mapBoLi', function() {
        return function(str) {
            var newstr = str.replace(/玻璃单独破碎险保额:3.0/g, "玻璃单独破碎险:国产");
            return newstr.replace(/玻璃单独破碎险保额:2.0/g, "玻璃单独破碎险:进口");
        };
    })