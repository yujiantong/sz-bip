
'use strict';
angular.module('starter')
  .service("xbzyHomeService",['$http','$q', function($http,$q){
    // 首页
    this.findHomePageCount = function(){
      var deferred = $q.defer();
      $http.post('/api/common/findHomePageCount')
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
    //根据4s店id查询保险公司信息
    this.findCompInfoByStoreId = function(){
      var deferred = $q.defer();
      $http.post('/api/setting/findCompInfoByStoreId')
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
    //按4s店ID查询车辆品牌车型信息
    this.findCarInfoByStoreId = function(){
      var deferred = $q.defer();
      $http.post('/api/admin/findCarInfoByStoreId')
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
    //潜客查询潜客列表
    this.findCustomerByConditionApp = function(obj){
      var deferred = $q.defer();
      $http.post('/api/mobile/findCustomerByConditionApp',{params:JSON.stringify(obj)})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
}]);

