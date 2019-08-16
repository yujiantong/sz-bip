'use strict';
angular.module('myApp')
    .service('superAdminService', ['$http','$q', function($http,$q){
        //查询险种
        this.findInsu = function(){
            var deferred = $q.defer();
            $http.post('/admin/findInsuranceType')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //删除险种
        this.deleteInsu = function(typeId){
            var deferred = $q.defer();
            $http.post('/admin/deleteInsuranceType',{typeId:typeId})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //提交新增险种
        this.addInsu = function(typeInfo){
            var deferred = $q.defer();
            $http.post('/admin/addInsuranceType',{typeInfo:JSON.stringify(typeInfo)})
                // $http.get('pcList.json')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //查询保险公司
        this.findInsuComp = function(){
            var deferred = $q.defer();
            $http.post('/admin/findInsuranceComp')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //删除保险公司
        this.deleteInsuComp = function(insuranceCompId){
            var deferred = $q.defer();
            $http.post('/admin/deleteInsuranceComp',{insuranceCompId:insuranceCompId})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //提交新增保险公司
        this.addInsuComp = function(companyInfo){
            var deferred = $q.defer();
            $http.post('/admin/addInsuranceComp',{companyInfo:JSON.stringify(companyInfo)})
                // $http.get('pcList.json')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //编辑保险公司
        this.modityInsuComp = function(companyInfo){
            var deferred = $q.defer();
            $http.post('/admin/updateInsuranceComp',{companyInfo:JSON.stringify(companyInfo)})
                // $http.get('pcList.json')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //查询汽车品牌
        this.findcarBrand = function(condition){
            var deferred = $q.defer();
            $http.post('/admin/findCarBrand',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //删除汽车品牌
        this.deleteCarBrand = function(brandId){
            var deferred = $q.defer();
            $http.post('/admin/deleteCarBrand',{brandId:brandId})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //提交新增汽车品牌
        this.addCarBrand = function(carBrandInfo){
            var deferred = $q.defer();
            $http.post('/admin/addCarBrand',{carBrandInfo:JSON.stringify(carBrandInfo)})
                // $http.get('pcList.json')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //编辑汽车品牌
        this.updateCarBrand = function(carBrandInfo){
            var deferred = $q.defer();
            $http.post('/admin/updateCarBrand',{carBrandInfo:JSON.stringify(carBrandInfo)})
                // $http.get('pcList.json')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //查询车型
        this.findCartype = function(){
            var deferred = $q.defer();
            $http.post('/admin/findCarModel')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //删除车型
        this.deleteCartype = function(modelId){
            var deferred = $q.defer();
            $http.post('/admin/deleteCarModel',{modelId:modelId})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //新增车型
        this.addCarModel = function(carModelInfo){
            var deferred = $q.defer();
            $http.post('/admin/addCarModel',{carModelInfo:JSON.stringify(carModelInfo)})
                // $http.get('pcList.json')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };


        //查询4S店
        this.findStore = function(condition){
            var deferred = $q.defer();
            $http.post('/admin/findStore',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //删除4S店
        this.deleteStore = function(storeId){
            var deferred = $q.defer();
            $http.post('/admin/deleteStore',{storeId:storeId})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //初始化4S店数据
        this.formatStoreById = function(storeId,loginName,password){
            var deferred = $q.defer();
            $http.post('/admin/formatStoreById',{storeId:storeId,loginName:loginName,password:password})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //提交新增4S店
        this.addStoreSubmit = function(storeInfo){
            var deferred = $q.defer();
            $http.post('/admin/addStore',{storeInfo:JSON.stringify(storeInfo)})
                // $http.get('pcList.json')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //编辑4S店
        this.modityStore = function(storeInfo){
            var deferred = $q.defer();
            $http.post('/admin/updateStore',{storeInfo:JSON.stringify(storeInfo)})
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
        //查询用户
        this.findUser_xtyh = function(){
            var deferred = $q.defer();
            $http.post('/user/findUser_xtyh')
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

        //查询角色
        this.findRole_xtyh = function(){
            var deferred = $q.defer();
            $http.post('/user/findRole_xtyh')
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
        //新增系统通知信息
        this.insertSysMessage = function(content){
            var deferred = $q.defer();
            $http.post('/common/insertSysMessage',{content:content})
                // $http.get('pcList.json')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //删除系统通知信息
        this.deleteSysMessage = function(sysMessageId){
            var deferred = $q.defer();
            $http.post('/common/deleteSysMessage',{sysMessageId:sysMessageId})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //查询BSP-4S店
        this.findBspStore = function(sysMessageId){
            var deferred = $q.defer();
            $http.post('/sysn/findBspStore')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //绑定BSP-4S店方法
        this.sysnBspStore = function(bspStoreName,bspStoreId,storeId){
            var deferred = $q.defer();
            $http.post('/sysn/sysnBspStore',{bspStoreName:bspStoreName,bspStoreId:bspStoreId,storeId:storeId})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //解除绑定BSP-4S店方法
        this.delBangedBspStore = function(storeId){
            var deferred = $q.defer();
            $http.post('/sysn/delBangedBspStore',{storeId:storeId})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //查询建议
        this.selectAllSuggest = function(searchDatas,start){
            var deferred = $q.defer();
            $http.post('/suggest/selectAllSuggest',{searchDatas:JSON.stringify(searchDatas),start:start})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //解决建议
        this.solveSuggest = function(param){
            var deferred = $q.defer();
            $http.post('/suggest/solveSuggest',{param:JSON.stringify(param)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //根据用户名重置密码
        this.dglyResetPassword = function(loginName){
            var deferred = $q.defer();
            $http.post('/user/dglyResetPassword',{loginName:loginName})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //查询用户--行政建店
        this.findUser_xzjd = function(){
            var deferred = $q.defer();
            $http.post('/user/findUser_xzjd')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //查询角色--行政建店
        this.findRole_xzjd = function(){
            var deferred = $q.defer();
            $http.post('/user/findRole_xzjd')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //提交新增厂家
        this.insert = function(condition){
            var deferred = $q.defer();
            $http.post('/vender/insert',{condition:JSON.stringify(condition)})
                // $http.get('pcList.json')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //查询厂家
        this.findVenderByCondition = function(condition){
            var deferred = $q.defer();
            $http.post('/vender/findVenderByCondition',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //编辑厂家
        this.updateVender = function(condition){
            var deferred = $q.defer();
            $http.post('/vender/update',{condition:JSON.stringify(condition)})
                // $http.get('pcList.json')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //查询集团
        this.findBlocByCondition = function(data){
            var deferred = $q.defer();
            $http.post('/bloc/findByCondition',{data:JSON.stringify(data)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //提交新增集团
        this.addBlocFun = function(data){
            var deferred = $q.defer();
            $http.post('/bloc/addBloc',{data:JSON.stringify(data)})
                // $http.get('pcList.json')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //删除集团
        this.deleteBloc = function(data){
            var deferred = $q.defer();
            $http.post('/bloc/deleteBloc',{data:JSON.stringify(data)})
                // $http.get('pcList.json')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //编辑集团
        this.updateBloc = function(data){
            var deferred = $q.defer();
            $http.post('/bloc/updateBloc',{data:JSON.stringify(data)})
                // $http.get('pcList.json')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //校验集团的信息是否存在
        this.findExistByCondition = function(data){
            var deferred = $q.defer();
            $http.post('/bloc/findExistByCondition',{data:JSON.stringify(data)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //校验4S店的信息是否存在
        this.findExistStoreByCondition = function(condition){
            var deferred = $q.defer();
            $http.post('/admin/findExistStoreByCondition',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //按品牌名称首字母大小排序查询所有品牌
        this.findCarBrandByOrder = function(condition){
            var deferred = $q.defer();
            $http.post('/admin/findCarBrandByOrder',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //查询区域分析师和店的关系-行政建店
        this.findUser_xzjd_store = function(){
            var deferred = $q.defer();
            $http.post('/user/findUser_xzjd_store')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //修改区域分析和店之间的关联
        this.findStoreByUser = function(dataAnalystId){
            var deferred = $q.defer();
            $http.post('/user/findStoreByUser',{dataAnalystId:dataAnalystId})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //根据区域分析师的ID查询绑定的店
        this.updateUserAndStore = function(condition){
            var deferred = $q.defer();
            $http.post('/user/updateUserAndStore',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //根据险种ID查询险种
        this.findInsuByTypeId = function(typeId){
            var deferred = $q.defer();
            $http.post('/admin/findInsuByTypeId',{typeId:typeId})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //修改险种
        this.updateInsu = function(condition){
            var deferred = $q.defer();
            $http.post('/admin/updateInsu',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //营销短信充值
        this.messageRecharge = function(storeInfo){
            var deferred = $q.defer();
            $http.post('/admin/messageRecharge',{storeInfo:JSON.stringify(storeInfo)})
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