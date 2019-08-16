'use strict';
angular.module('myApp')
    .service('adminService', ['$http','$q', function($http,$q){
        //查询用户
        this.findUser = function(storeId){
            var deferred = $q.defer();
            $http.post('/user/findUser',{storeId:storeId})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //删除用户
        this.deleteUser = function(id,roleId){
            var deferred = $q.defer();
            $http.post('/user/deleteUser',{id:id,roleId:roleId})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //重置密码
        this.resetPassword = function(id){
            var deferred = $q.defer();
            $http.post('/user/resetPassword',{id:id})
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

        //查询角色
        this.findRole = function(){
            var deferred = $q.defer();
            $http.post('/user/findRole')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //提交新增用户信息
        this.addUser = function(userInfo){
            var deferred = $q.defer();
            $http.post('/user/addUser',{userInfo:JSON.stringify(userInfo)})
                // $http.get('pcList.json')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
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

        //编辑用户
        this.modityUser = function(userInfo){
            var deferred = $q.defer();
            $http.post('/user/updateUser',{userInfo:JSON.stringify(userInfo)})
                // $http.get('pcList.json')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //绑定用户
        this.sysnBspUser = function(bangParam){
            var deferred = $q.defer();
            $http.post('/sysn/sysnBspUser',{bangParam:JSON.stringify(bangParam)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //解除绑定的用户
        this.delBangedBspUser = function(delBangParam){
            var deferred = $q.defer();
            $http.post('/sysn/delBangedBspUser',{delBangParam:JSON.stringify(delBangParam)})
                // $http.get('pcList.json')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //根据bip的店id查询所有的未绑定的用户
        this.findNoBangedUser = function(storeId){
            var deferred = $q.defer();
            $http.post('/sysn/findNoBangedUser',{storeId:storeId})
                // $http.get('pcList.json')
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
        //根据bip的店id查询所有的用户（前提是bip的店已经和bsp店绑定好了）
        this.findBipBspUser = function(storeId){
            var deferred = $q.defer();
            $http.post('/sysn/findBipBspUser',{storeId:storeId})
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