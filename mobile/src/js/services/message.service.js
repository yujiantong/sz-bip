
'use strict';
angular.module('starter')
  .service("messageService",['$http','$q', function($http,$q){
    //查询发送过的短信
    this.findPhoneMessage = function(obj){
      var deferred = $q.defer();
      $http.post('/api/message/findPhoneMessage',{params:JSON.stringify(obj)})
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
}]);

