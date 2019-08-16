
'use strict';
angular.module('starter')
  .service("customerAddService",['$http','$q', function($http,$q){
    //提交新增潜客信息
    this.addCustomer = function(customerInfo,generateCustomerFlag){
      var deferred = $q.defer();
      $http.post('/api/customer/addCustomer',{customerInfo:JSON.stringify(customerInfo),generateCustomerFlag:generateCustomerFlag})
        // $http.get('pcList.json')
        .success(function(result){
          deferred.resolve(result);
        })
        .error(function(result){
          deferred.reject(result);
        });
      return deferred.promise;
    };
}]);

