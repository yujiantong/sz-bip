'use strict';
angular.module('myApp')
    .service('recordService', ['$http','$q', function($http,$q){
        // 查询最近的更新密码操作记录
        this.findByStoreAndTime = function(condition){
            var deferred = $q.defer();
            $http.post('/updatePasswordRecord/findByStoreAndTime',{params:JSON.stringify(condition)})
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
        // 查询最近的更新密码操作记录
        this.findLatestRecordByStore = function(condition){
            var deferred = $q.defer();
            $http.post('/updatePasswordRecord/findLatestRecordByStore',{params:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        // 新增更新密码记录
        this.addUpdateRecord = function(condition){
            var deferred = $q.defer();
            $http.post('/updatePasswordRecord/addUpdateRecord',{params:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

    }]);