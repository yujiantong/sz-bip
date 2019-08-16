'use strict';
angular.module('starter')
  .service("loginService",['$http','$q','server', function($http,$q,server){
    // 登录
    this.login = function(obj){
      var deferred = $q.defer();
        $http.post('/login',obj)
        .success(function(result){
            deferred.resolve(result);
        })
        .error(function(result){
            deferred.reject(result);
        });
      return deferred.promise;
    };
    // 修改密码
    this.modifyPassword = function(obj){
      var deferred = $q.defer();
        $http.get('/access/control/restPassword',{params:obj})
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
