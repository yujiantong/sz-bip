'use strict';
angular.module('myApp')
    .filter('mapBXDJ', function() {
        var genderHash = {
            0:'否',
            1:'是',
            2:'是',
            3:'是',
            4:'是'

        };

        return function(input) {
            if (input>=0&&input<=4){
                return genderHash[input];
            } else {
                return '';
            }
        };
    })