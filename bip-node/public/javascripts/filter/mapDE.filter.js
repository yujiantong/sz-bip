'use strict';
angular.module('myApp')
    .filter('mapDE', function() {
        var genderHash = {
            1: '启用',
            2: '禁用'
        };

        return function(input) {
            if (input==1||input==2){
                return genderHash[input];
            } else {
                return '';
            }
        };
    })