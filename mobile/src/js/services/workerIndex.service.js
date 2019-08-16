
'use strict';
angular.module('starter')
  .service("workerIndexService",['$http','$q', function($http,$q){
    /**
     * 查询待回退员工列表
     * param: storeId
     */
    this.findDHTWorkCollection = function(obj){
      var deferred = $q.defer();
        $http.post('/api/mobile/findDHTWorkCollection',{params:JSON.stringify(obj)})
        .success(function(result){
            deferred.resolve(result);
        })
        .error(function(result){
            deferred.reject(result);
        });
      return deferred.promise;
    };

    /**
     * 查询今日邀约员工列表
     * param: storeId
     */
    this.findJRYYWorkerCollection = function(){
      var deferred = $q.defer();
      $http.post('/api/mobile/findJRYYWorkerCollection')
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
    /**
     * 查询未接收员工列表
     * param: storeId
     */
    this.findWJSWorkCollection = function(){
      var deferred = $q.defer();
      $http.post('/api/mobile/findWJSWorkCollection')
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };

    /**
     * 查询应跟踪员工列表
     * param: storeId
     */
    this.findYGZWorkCollection = function(traceStatu){
      var deferred = $q.defer();
      $http.post('/api/mobile/findYGZWorkCollection',{traceStatu:traceStatu})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };

    /**
     * 查询到店未出单员工列表
     * param: storeId
     */
    this.findDDWCDWorkCollection = function(){
      var deferred = $q.defer();
      $http.post('/api/mobile/findDDWCDWorkCollection')
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
    /**
     * 查询已脱保员工列表
     * param: storeId
     */
    this.findTBWorkCollection = function(obj){
      var deferred = $q.defer();
      $http.post('/api/mobile/findTBWorkCollection',{params:JSON.stringify(obj)})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
    /**
     * 查询跟踪完成员工列表
     * param: storeId
     */
    this.findGZWCWorkCollection = function(obj){
      var deferred = $q.defer();
      $http.post('/api/mobile/findGZWCWorkCollection',{params:JSON.stringify(obj)})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
    /**
     * 查询已回退员工列表
     * param: storeId
     */
    this.findYHTWorkCollection = function(obj){
      var deferred = $q.defer();
      $http.post('/api/mobile/findYHTWorkCollection',{params:JSON.stringify(obj)})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
    /**
     * 查询战败线索员工列表
     * param: storeId
     */
    this.findZBXSWorkCollection = function(obj){
      var deferred = $q.defer();
      $http.post('/api/mobile/findZBXSWorkCollection',{params:JSON.stringify(obj)})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
}]);

