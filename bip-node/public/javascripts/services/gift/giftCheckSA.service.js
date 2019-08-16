'use strict';
angular.module('myApp')
    .service('giftCheckSAService', ['$http','$q', function($http,$q){
        //根据条件查询赠送核销记录
        this.findGivingByCondition = function(condition){
            var deferred = $q.defer();
            $http.post('/gift/findGivingByCondition',{condition:JSON.stringify(condition)})
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
        //修改赠送核销信息
        this.updateGiving = function(condition){
            var deferred = $q.defer();
            $http.post('/gift/updateGiving',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //打印核销单
        this.printHxd = function(approvalBillId){
            var deferred = $q.defer();
            $http.post('/gift/printHxd',{approvalBillId:approvalBillId})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //根据审批单ID查询赠送信息
        this.findAllHxRecordByApprovalBillId = function(condition){
            var deferred = $q.defer();
            $http.post('/gift/findAllHxRecordByApprovalBillId',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
    }]);