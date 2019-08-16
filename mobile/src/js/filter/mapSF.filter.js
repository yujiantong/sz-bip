'use strict';
angular.module('starter')
  .filter('mapSF', function() {
    return function(input) {
      if (input!=null&&input==1){
        return '是';
      } else {
        return '否';
      }
    };
  })
