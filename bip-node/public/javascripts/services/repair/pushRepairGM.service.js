/**
 * Created by ben on 2016/12/28.
 */
'use strict';
angular.module('myApp')
    .service('pushRepairGMService', ['$http','$q', function($http,$q){
        //台帐的推送修查询
        this.findTzPushMaintenance = function(condition){
            var deferred = $q.defer();
            $http.post('/maintenance/findTzPushMaintenance',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
    }]);
