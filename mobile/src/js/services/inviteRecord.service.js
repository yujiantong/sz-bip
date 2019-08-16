
'use strict';
angular.module('starter')
  .service("inviteRecordService",['$http','$q', function($http,$q){
    //可删除邀约
    this.selectKSCYY = function(customerId,currentPage){
      var deferred = $q.defer();
      $http.post('/api/mobile/selectKSCYY',{customerId:customerId,currentPage:currentPage})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };

    //可删除邀约详情
    this.selectKSCYYXQ = function(customerTraceId){
      var deferred = $q.defer();
      $http.post('/api/mobile/selectKSCYYXQ',{customerTraceId:customerTraceId})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };

    //续保专员跟踪删除邀约
    this.deleteInvite = function(customerTraceId,scyyyy,customerId,principalId,principal){
      var deferred = $q.defer();
      $http.post('/api/customer/deleteInvite',{customerTraceId:customerTraceId,scyyyy:scyyyy,customerId:customerId,principalId:principalId,principal:principal})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };

}]);

