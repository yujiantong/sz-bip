'use strict';
angular.module('myApp')
    .filter('mapSF', function() {
        var genderHash = {
            0: '否',
            1: '是'
        };

        return function(input) {
            if (input==0||input==1){
                return genderHash[input];
            } else {
                return '';
            }
        };
    })