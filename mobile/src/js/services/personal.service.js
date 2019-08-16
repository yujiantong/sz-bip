'use strict';
angular.module('starter')
  .service("personalService",['$http','$q', function($http,$q){
    //查询店员工列表
    this.findUsersByStoreId = function(){
      var deferred = $q.defer();
      $http.post('/api/mobile/findUsersByStoreId')
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };

    //暂停或禁止用户操作
    this.pauseOrForbidden = function(userId,status,roleId){
      var deferred = $q.defer();
      $http.post('/api/user/updateUserStatus',{id:userId,status:status,roleId:roleId})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };

    /**
     * 修改密码
     * param: storeId
     */
    this.changePassword = function(obj){
      var deferred = $q.defer();
      $http.post('/api/user/updatePassword',obj)
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
    /**
     * 新增建议
     * param: storeId
     */
    this.addSuggest = function(obj){
      var deferred = $q.defer();
      $http.post('/api/suggest/addSuggest',{suggestInfo:JSON.stringify(obj)})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
}]);

