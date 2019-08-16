
'use strict';
angular.module('starter')
  .service("billDetailsService",['$http','$q', function($http,$q){
    //按ID查询保单明细
    this.findBillDetailsById = function(insuranceBillId){
      var deferred = $q.defer();
      $http.get('/api/insurance/findDetail?insuranceBillId='+insuranceBillId)
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };


}]);

