'use strict';
angular.module('myApp')
    .service('userListService', ['$http','$q', function($http,$q){
        this.getPc = function(obj){
            var deferred = $q.defer();
            $http.get('/users')
                // $http.get('pcList.json')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        this.delUser = function(obj){
            var deferred = $q.defer();
            console.log("delUser-->" + JSON.stringify(obj));
            $http.post('/deleteUser',{id:obj.id})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        }
    }]);