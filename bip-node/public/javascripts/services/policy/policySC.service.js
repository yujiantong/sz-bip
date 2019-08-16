'use strict';
angular.module('myApp')
    .service('policySCService', ['$http','$q', function($http,$q){
        //按承保类型查询保单信息
        this.getSingleAll = function(coverType,startTime,endTime,startNum,showAll,short,shortmain){
            var deferred = $q.defer();
            $http.post('/insurance/findSCOrSAInsuranceBill',{coverType:coverType,startTime:startTime,endTime:endTime,
                    startNum:startNum,showAll:showAll,short:short,shortmain:shortmain})
                // $http.get('pcList.json')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //按条件查询保单信息
        this.getSingleByCondition = function(searchDatas,startNum){
            var deferred = $q.defer();
            $http.post('/insurance/findAllSCOrSAInsuranceBill',{condition:JSON.stringify(searchDatas),startNum:startNum})
                // $http.get('pcList.json')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //按ID查询保单明细
        this.getSingleById = function(insuranceBillId){
            var deferred = $q.defer();
            $http.get('/insurance/findDetail?insuranceBillId='+insuranceBillId)
                // $http.get('pcList.json')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //查询跟踪记录
        this.findRecord = function(insuranceBillId){
            var deferred = $q.defer();
            $http.get('/insurance/findRecord?insuranceBillId='+insuranceBillId)
                // $http.get('pcList.json')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //查询邀约信息
        this.Solicitation = function(startTime,endTime){
            var deferred = $q.defer();
            $http.get('/insurance/findRecord?insuranceBillId=1')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //按4s店ID查询车辆品牌车型信息
        this.findCarInfoByStoreId = function(){
            var deferred = $q.defer();
            $http.post('/admin/findCarInfoByStoreId')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //查询本店各种用户
        this.findKindsUser = function(){
            var deferred = $q.defer();
            $http.post('/user/findKindsUser')
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