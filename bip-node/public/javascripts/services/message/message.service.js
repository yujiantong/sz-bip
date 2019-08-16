/**
 * Created by ben on 2016/12/28.
 */
'use strict';
angular.module('myApp')
    .service('messageService', ['$http','$q', function($http,$q){
        //营销管理模块查询
        this.findSMSByCondition = function(){
            var deferred = $q.defer();
            $http.post('/smsTemplate/findByCondition')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //新增营销管理模块
        this.saveSmsTemplate = function(condition){
            var deferred = $q.defer();
            $http.post('/smsTemplate/saveSmsTemplate',{condition:JSON.stringify(condition)})
                // $http.get('pcList.json')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //修改营销管理模块
        this.updateTemplateById = function(condition){
            var deferred = $q.defer();
            $http.post('/smsTemplate/updateTemplateById',{condition:JSON.stringify(condition)})
                // $http.get('pcList.json')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //禁用/启用营销模板
        this.updateEnabledState = function(id,enabledState){
            var deferred = $q.defer();
            $http.post('/smsTemplate/updateEnabledState',{id:id,enabledState:enabledState})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //删除营销模板
        this.deleteTemplateById = function(id){
            var deferred = $q.defer();
            $http.post('/smsTemplate/deleteTemplateById',{id:id})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //查询发送过的短信
        this.findPhoneMessage = function(params){
            var deferred = $q.defer();
            $http.post('/message/findPhoneMessage',{params:JSON.stringify(params)})
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
