'use strict';
angular.module('myApp')
    .service('customerSaMService', ['$http','$q', function($http,$q){

        //根据跟踪状态查询
        this.findByTraceStatu = function(condition){
            var deferred = $q.defer();
            $http.post('/customer/findByTraceStatu',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //根据保单日期状态查询
        this.findByCusLostInsurStatu = function(condition){
            var deferred = $q.defer();
            $http.post('/customer/findByCusLostInsurStatu',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //根据接收状态查询
        this.findByAcceptStatu = function(condition){
            var deferred = $q.defer();
            $http.post('/customer/findByAcceptStatu',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //根据回退状态查询
        this.findByReturnStatu = function(condition){
            var deferred = $q.defer();
            $http.post('/customer/findByReturnStatu',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //待审批查询
        this.findByApproval = function(condition){
            var deferred = $q.defer();
            $http.post('/customer/findByApproval',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //按条件查询保单信息
        this.findByCondition = function(searchDatas){
            var deferred = $q.defer();
            $http.post('/customer/findByCondition',{searchDatas:JSON.stringify(searchDatas)})
                // $http.get('pcList.json')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
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

        //同意回退
        this.traceReturn = function(customerId,clerkId,tyhtyj,principalId,principal){
            var deferred = $q.defer();
            $http.post('/customer/returnBySCM',{customerId:customerId,clerkId:clerkId,tyhtyj:tyhtyj,
                    principalId:principalId,principal:principal})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //查询负责人列表，去除当前负责人
        this.findAllSubordinate = function(principalId){
            var deferred = $q.defer();
            $http.post('/user/findAllSubordinate',{principalId:principalId})
                // $http.get('pcList.json')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //销售经理更新负责人
        this.replacePrincipalSaM = function(clerkId,clerk,customerId,principalId,principal,ghfzryy){
            var deferred = $q.defer();
            $http.post('/customer/managerChangePrincipal',{clerkId:clerkId,clerk:clerk,customerId:customerId,
                    principalId:principalId,principal:principal,ghfzryy:ghfzryy})
                // $http.get('pcList.json')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //销售经理不同意回退
        this.unAgreeReturnBySCM = function(customerId,clerkId,principalId,principal,jjhtyy){
            var deferred = $q.defer();
            $http.post('/customer/unAgreeReturnBySCM',{customerId:customerId,clerkId:clerkId,principalId:principalId,principal:principal,jjhtyy:jjhtyy})
                // $http.get('pcList.json')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //销售统计查询
        this.findSaleStatistics = function(startDate,endDate,showAll){
            var deferred = $q.defer();
            $http.post('/statistic/findSaleStatistics',{startDate:startDate,endDate:endDate,showAll:showAll})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //暂停或禁止用户操作
        this.pauseOrForbidden = function(userId,status,roleId){
            var deferred = $q.defer();
            $http.post('/user/updateUserStatus',{id:userId,status:status,roleId:roleId})
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
        //查询本店各种用户
        this.selectUserForHolderSearch = function(){
            var deferred = $q.defer();
            $http.post('/user/selectUserForHolderSearch',{roleId:6})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //按潜客ID查询该潜客所有的报价信息
        this.findListCustomerBJRecode = function(customerId){
            var deferred = $q.defer();
            $http.post('/customer/findListCustomerBJRecode',{customerId:customerId})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //查询负责人列表
        this.findSubordinate = function(){
            var deferred = $q.defer();
            $http.post('/user/findSubordinate')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //批量更换负责人
        this.changePrincipalBatch = function(data){
            var deferred = $q.defer();
            $http.post('/customer/changePrincipalBatchSM',{data:JSON.stringify(data)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //查询到店未出单潜客
        this.findDdwcdCus = function(condition){
            var deferred = $q.defer();
            $http.post('/customer/findDdwcdCus',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //主动回退
        this.returnByXSJLZD = function(customerId,clerkId,tyhtyj,principalId,principal){
            var deferred = $q.defer();
            $http.post('/customer/returnByXSJLZD',{customerId:customerId,clerkId:clerkId,tyhtyj:tyhtyj,
                    principalId:principalId,principal:principal})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //查询已回退潜客记录数
        this.findByYiHuiTui = function(condition){
            var deferred = $q.defer();
            $http.post('/customer/findByYiHuiTui',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //根据条件查询维修记录
        this.findwxRecordByCondition = function(condition){
            var deferred = $q.defer();
            $http.post('/maintenance/findByCondition',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //根据施工单号和店ID查询维修项目以及维修配件
        this.findByMaintainNumber = function(maintainNumber){
            var deferred = $q.defer();
            $http.post('/maintenance/findByMaintainNumber',{maintainNumber:maintainNumber})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //根据条件查询推送修记录
        this.findByConditionTSX = function(condition){
            var deferred = $q.defer();
            $http.post('/maintenance/findByConditionTSX',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //推送修明细
        this.findPMaintenanceByRNumber = function(reportNumber){
            var deferred = $q.defer();
            $http.post('/maintenance/findPMaintenanceByRNumber',{reportNumber:reportNumber})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //查询潜客审批单记录
        this.findApprovalBillRecordList = function(chassisNumber){
            var deferred = $q.defer();
            $http.post('/customer/findApprovalBillRecordList',{chassisNumber:chassisNumber})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
    }]);