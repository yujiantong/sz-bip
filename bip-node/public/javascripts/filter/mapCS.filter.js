'use strict';
angular.module('myApp')
    .filter('mapCS', function() {
        var genderHash = {
            0: '失败',
            1: '成功'
        };

        return function(input) {
            if (input==0||input==1){
                return genderHash[input];
            } else {
                return '';
            }
        };
    })