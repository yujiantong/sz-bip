'use strict';
angular.module('myApp')
    .filter('mapZPLX', function() {
        var genderHash = {
            1:'服务类',
            2:'精品类',
            3:'礼包类',
            4:'储值卡',
            5:'会员积分'
        };

        return function(input) {
            if (input>=1&&input<=5){
                return genderHash[input];
            } else {
                return '';
            }
        };
    })