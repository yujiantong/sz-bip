
'use strict';
angular.module('starter')
  .service("myHomePageService",['$http','$q', function($http,$q){
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
    //查询4S店
    this.findStore = function(condition){
      var deferred = $q.defer();
      $http.post('/api/admin/findStore',{condition:JSON.stringify(condition)})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
    //数据分析员--换店查询
    this.changeStoreCookies = function(store){
      var deferred = $q.defer();
      $http.post('/api/changeStoreCookies',{store:JSON.stringify(store)})
        // $http.get('pcList.json')
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
    //查询本店各种用户
    this.selectUserForHolderSearch = function(){
      var deferred = $q.defer();
      $http.post('/api/user/selectUserForHolderSearch')
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
    // 极光推送，保存设备ID
    this.addJPush = function(obj){
      var deferred = $q.defer();
      $http.post('/api/jpush/addJpush',obj)
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
}]);

