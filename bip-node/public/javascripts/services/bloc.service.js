'use strict';
angular.module('myApp')
    .service('blocService', ['$http','$q', function($http,$q){
        //查询用户
        this.findUser_jtgl = function(condition){
            var deferred = $q.defer();
            $http.post('/user/findUser_jtgl',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //按条件查询事业部门
        this.findUnitByCondition = function(condition){
            var deferred = $q.defer();
            $http.post('/unit/findUnitByCondition',{condition:JSON.stringify(condition)})
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

        //查询角色--集团管理员
        this.findRoleByBloc = function(condition){
            var deferred = $q.defer();
            $http.post('/user/findRoleByBloc',{condition:JSON.stringify(condition)})
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
        //新增事业部门
        this.division = function(unitName){
            var deferred = $q.defer();
            $http.post('/unit/insert',{unitName:unitName})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //查询店
        this.findStore = function(unitId){
            var deferred = $q.defer();
            $http.post('/unit/findStore',{unitId:unitId})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //修改事业部门和店之间的关联
        this.updateUnitAndStore = function(condition){
            var deferred = $q.defer();
            $http.post('/unit/updateUnitAndStore',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
    }]);