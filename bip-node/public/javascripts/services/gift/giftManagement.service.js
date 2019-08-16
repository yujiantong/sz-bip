/**
 * Created by ben on 2016/12/28.
 */
'use strict';
angular.module('myApp')
    .service('giftManagementService', ['$http','$q', function($http,$q){
        //根据赠品类型等条件查询赠品
        this.findGiftByCondition = function(condition){
            var deferred = $q.defer();
            $http.post('/gift/findGiftByCondition',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //新增赠品
        this.addGift = function(giftInfo){
            var deferred = $q.defer();
            $http.post('/gift/addGift',{giftInfo:JSON.stringify(giftInfo)})
                // $http.get('pcList.json')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //修改赠品
        this.updateGiftByCode = function(giftInfo){
            var deferred = $q.defer();
            $http.post('/gift/updateGiftByCode',{giftInfo:JSON.stringify(giftInfo)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //暂停或禁止用户操作
        this.updateGiftStaus = function(giftCode,status){
            var deferred = $q.defer();
            $http.post('/gift/updateGiftStaus',{giftCode:giftCode,status:status})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //根据赠品编码或者名称自动联想查询赠品
        this.findGiftByCodeOrName = function(searchCondition,giftType){
            var deferred = $q.defer();
            $http.post('/gift/findGiftByCodeOrName',{searchCondition:searchCondition,giftType:giftType})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
    }]);
