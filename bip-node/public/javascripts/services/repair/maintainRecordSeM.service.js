'use strict';
angular.module('myApp')
    .service('maintainRecordSeMService', ['$http','$q', function($http,$q){
        //根据条件查询维修记录
        this.findwxRecordByCondition = function(condition){
            var deferred = $q.defer();
            $http.post('/maintenance/findByCondition',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //根据施工单号和店ID查询维修项目以及维修配件
        this.findByMaintainNumber = function(maintainNumber){
            var deferred = $q.defer();
            $http.post('/maintenance/findByMaintainNumber',{maintainNumber:maintainNumber})
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
            $http.post('/user/selectUserForHolderSearch',{roleId:8})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
    }]);