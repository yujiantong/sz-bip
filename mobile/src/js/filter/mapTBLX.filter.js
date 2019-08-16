'use strict';
angular.module('starter')
    .filter('mapTBLX', function() {
        var genderHash = {
            1:'新保',
            2:'新转续',
            3:'续转续',
            4:'间转续',
            5:'潜转续',
            6:'首次'

        };

        return function(input) {
            if (input>=1&&input<=6){
                return genderHash[input];
            } else {
                return '';
            }
        };
    })
