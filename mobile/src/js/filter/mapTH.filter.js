'use strict';
angular.module('starter')
    .filter('mapTH', function() {
      return function(str) {
        var newstr = str.replace(/:/g, "：");
        return newstr.replace(/,|;/g, "　");
      };

    })
