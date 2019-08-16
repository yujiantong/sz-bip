'use strict';
angular.module('myApp')
    .service('paramDAService', ['$http','$q', function($http,$q){

        //级别跟踪天数查询
        this.LevelSearch = function(){
            var deferred = $q.defer();
            $http.post('/setting/findTraceDaySet')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //修改级别跟踪天数
        this.LevelSet = function(LevelAll){
            var deferred = $q.defer();
            $http.post('/setting/updateTraceDaySet',{traceDaySetInfo:JSON.stringify(LevelAll)})
                // $http.get('pcList.json')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //级别锁死设置查询
        this.lockLevel = function(storeId){
            var deferred = $q.defer();
            $http.post('/common/findStoreById',{storeId:storeId})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //模块开启设置查询
        this.moduleSearch = function(){
            var deferred = $q.defer();
            $http.post('/setting/findModuleSet')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //修改模块开启设置
        this.moduleSet = function(modulesetAll){
            var deferred = $q.defer();
            $http.post('/setting/updateModuleSet',{moduleSetInfo:JSON.stringify(modulesetAll)})
                // $http.get('pcList.json')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        // 查询选中的保险公司
        this.InsuranceCompSearch = function(){
            var deferred = $q.defer();
            $http.get('/setting/initInsuranceComp')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //修改选中的保险公司
        this.InsuranceCompSet = function(insuranceCompIds,fourSId){
            var deferred = $q.defer();
            $http.post('/setting/updateInsuranceComp',{insuranceCompIds:JSON.stringify(insuranceCompIds),fourSId:fourSId})
                // $http.get('pcList.json')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };


        // 查询手续费
        this.FactorageSearch = function(compPreId){
            var deferred = $q.defer();
            $http.post('/setting/findFactorage',{compPreId:compPreId})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //修改手续费设置
        this.factorageSet = function(FactoragesetAll){
            var deferred = $q.defer();
            $http.post('/setting/updateFactorage',{factorageInfo:JSON.stringify(FactoragesetAll)})
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