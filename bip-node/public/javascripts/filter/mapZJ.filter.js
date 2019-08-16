'use strict';
angular.module('myApp')
    .filter('mapZJ', function() {
        return function(str) {
            if(str!=null&&str.length==18){
                return str.substring(0,6)+"********"+str.substring(14);
            }else{
                return str;
            }
        };
    })