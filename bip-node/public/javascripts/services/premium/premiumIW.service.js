/**
 * Created by ben on 2016/12/28.
 */
'use strict';
angular.module('myApp')
    .service('premiumIWService', ['$http','$q', function($http,$q){
        //根据条件查询保单及统计保费总额度
        this.findInformationAndPremiumCount = function(condition){
            var deferred = $q.defer();
            $http.post('/insurance/findInformationAndPremiumCount',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //查询本店各种用户
        this.findKindsUser = function(){
            var deferred = $q.defer();
            $http.post('/user/findKindsUser')
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
            $http.post('/setting/findCompInfoByStoreId')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //根据审批单ID查询赠送信息
        this.findGivingByApprovalBillId = function(approvalBillId){
            var deferred = $q.defer();
            $http.post('/gift/findGivingByApprovalBillId',{approvalBillId:approvalBillId})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
    }]);
