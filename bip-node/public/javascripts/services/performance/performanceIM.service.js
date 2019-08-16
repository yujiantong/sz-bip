/**
 * Created by qiumingyu on 2016/7/6.
 */
'use strict';
angular.module('myApp')
    .service('performanceIMService', ['$http','$q', function($http,$q){
        //初始化
       this.statisticalNewInsurance = function(coverType,statisticTime){
           var deferred = $q.defer();
           $http.post('/performance/statisticalNewInsurance',{coverType:coverType,statisticTime:statisticTime})
               .success(function(result){
                   deferred.resolve(result);
               })
               .error(function(result){
                   deferred.reject(result);
               });
           return deferred.promise;
       }

        //统计续保汇总
        this.statisticalAllInsurance = function(renewalType,statisticTime){
            var deferred = $q.defer();
            $http.post('/performance/statisticalByRenewalType',{renewalType:renewalType,statisticTime:statisticTime})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        }

        //统计新转续
        this.statisticalXinzxInsurance = function(renewalType,statisticTime){
            var deferred = $q.defer();
            $http.post('/performance/statisticalByRenewalType',{renewalType:renewalType,statisticTime:statisticTime})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        }

        //统计续转续
        this.statisticalXuzxInsurance = function(renewalType,statisticTime){
            var deferred = $q.defer();
            $http.post('/performance/statisticalByRenewalType',{renewalType:renewalType,statisticTime:statisticTime})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        }

        //统计间转续
        this.statisticalJianzxInsurance = function(renewalType,statisticTime){
            var deferred = $q.defer();
            $http.post('/performance/statisticalByRenewalType',{renewalType:renewalType,statisticTime:statisticTime})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        }

        //统计潜转续
        this.statisticalQianzxInsurance = function(renewalType,statisticTime){
            var deferred = $q.defer();
            $http.post('/performance/statisticalByRenewalType',{renewalType:renewalType,statisticTime:statisticTime})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        }

        //统计首次
        this.statisticalFirstInsurance = function(renewalType,statisticTime){
            var deferred = $q.defer();
            $http.post('/performance/statisticalByRenewalType',{renewalType:renewalType,statisticTime:statisticTime})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        }
    }]);
