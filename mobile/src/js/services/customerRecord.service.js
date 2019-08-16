
'use strict';
angular.module('starter')
  .service("customerRecordService",['$http','$q', function($http,$q){
    /**
     * 根据潜客id查询该潜客的所有跟踪记录
     * param: customerId
     */
  this.findRecordByCustomerId = function(obj){
    var deferred = $q.defer();
    $http.post('/api/mobile/findRecordByCustomerId',{params:JSON.stringify(obj)})
      .success(function(result){
        deferred.resolve(result);
      })
      .error(function(result){
        deferred.reject(result);
      });
    return deferred.promise;
  };
    /**
     * 根据潜客id查询该潜客的所有报价记录
     * param: customerId
     */
    this.findBjRecordByCustomerId = function(obj){
      var deferred = $q.defer();
      $http.post('/api/mobile/findBjRecordByCustomerId',{params:JSON.stringify(obj)})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
}]);

