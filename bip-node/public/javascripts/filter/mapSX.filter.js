'use strict';
angular.module('myApp')
    .filter('mapSX', function() {
        var genderHash = {
            1: '生效中',
            2: '未生效'
        };

        return function(input) {
            if (input==1||input==2){
                return genderHash[input];
            } else {
                return '';
            }
        };
    })