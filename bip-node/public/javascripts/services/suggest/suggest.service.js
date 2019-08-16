/**
 * Created by ben on 2016/12/28.
 */
'use strict';
angular.module('myApp')
    .service('suggestService', ['$http','$q', function($http,$q){
        //根据建议人ID查询建议
        this.findAllSuggestByUserId = function(condition){
            var deferred = $q.defer();
            $http.post('/suggest/findAllSuggestByUserId',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //根据建议人ID查询建议
        this.ceshi = function(parm){
            var deferred = $q.defer();
            $http.post('/customer/ceshi',{parm:JSON.stringify(parm)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

    }]);
