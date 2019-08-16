'use strict';
angular.module('myApp')
    .filter('mapLXFS', function() {

        return function(input) {
            if ((/^([0-9-]+)$/.test(input))){
                return input.substring(0,3)+"****"+input.substring(7);
            } else {
                return '';
            }
        };
    })