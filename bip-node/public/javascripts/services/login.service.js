'use strict';
angular.module('myApp')
    .service('loginService', ['$http','$q', function($http,$q){
        //安全退出
        this.logout = function(){
            var deferred = $q.defer();
            $http.post('/logout')
                // $http.get('pcList.json')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //修改密码
        this.changePassword = function(id, password,oldPassword){
            var deferred = $q.defer();
            $http.post('/user/updatePassword',{id:id,password:password,oldPassword:oldPassword})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //快捷栏数量查询
        this.findCountByUserIdTop = function(){
            var deferred = $q.defer();
            $http.post('/common/findCountByUserId')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //查询个人通知信息
        this.findMessageByUserId = function(){
            var deferred = $q.defer();
            $http.post('/common/findMessageByUserId')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //查询系统通知信息
        this.findSysMessage = function() {
            var deferred = $q.defer();
            $http.post('/common/findSysMessage')
                .success(function (result) {
                    deferred.resolve(result);
                })
                .error(function (result) {
                    deferred.reject(result);
                });
            return deferred.promise;
        }

        //根据用户id查询潜客
        this.findUserById = function() {
            var deferred = $q.defer();
            $http.post('/user/findUserById')
                .success(function (result) {
                    deferred.resolve(result);
                })
                .error(function (result) {
                    deferred.reject(result);
                });
            return deferred.promise;
        }

        //按客户ID查询信息
        this.findByCustomerId = function(customerId){
            var deferred = $q.defer();
            $http.get('/customer/findByCustomerId?customerId='+customerId)
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //检查该店是否已经绑定过
        this.checkStoreIsBang = function(storeId){
            var deferred = $q.defer();
            $http.post('/sysn/checkStoreIsBang',{storeId:storeId})
                // $http.get('pcList.json')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //新增建议
        this.addSuggest = function(suggestInfo,userInfo){
            suggestInfo.userId = userInfo.userId;
            suggestInfo.storeName = userInfo.store.storeName;
            suggestInfo.userRoleName = userInfo.role.roleName;
            suggestInfo.userName = userInfo.userName;
            suggestInfo.userPhone = userInfo.phone;
            suggestInfo.storeId = userInfo.store.storeId;
            var deferred = $q.defer();
            $http.post('/suggest/addSuggest',{suggestInfo:JSON.stringify(suggestInfo)})
                // $http.get('pcList.json')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //数据分析员--换店查询
        this.changeStoreCookies = function(store){
            var deferred = $q.defer();
            $http.post('/changeStoreCookies',{store:JSON.stringify(store)})
                // $http.get('pcList.json')
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

    }]);