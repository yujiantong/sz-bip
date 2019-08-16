'use strict';
angular.module('myApp')
    .service('customerCSMService', ['$http','$q', function($http,$q){

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
        //更新负责人
        this.replacePrincipal = function(clerkId,clerk,customerId,principalId,ghfzryy){
            var deferred = $q.defer();
            $http.post('/customer/managerChangePrincipal',{clerkId:clerkId,clerk:clerk,customerId:customerId,
                principalId:principalId,ghfzryy:ghfzryy})
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

        //客服统计查询
        this.findCSCStatistics = function(startDate,endDate,showAll){
            var deferred = $q.defer();
            $http.post('/statistic/findCSCStatistics',{startDate:startDate,endDate:endDate,showAll:showAll})
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

        //查询bsp战败从而转到bip的潜客
        this.findDefeatCustomer = function(short,shortmain,startTime,endTime,startNum,showAll,sxyy){
            var deferred = $q.defer();
            $http.post('/customer/findDefeatCustomer',{short:short,shortmain:shortmain,startTime:startTime,endTime:endTime,startNum:startNum,showAll:showAll,sxyy:sxyy})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //战败潜客
        this.saveDefeatCustomer = function(obj){
            var deferred = $q.defer();
            var storeId = obj.storeId;
            var contactWay = obj.contactWay;
            $http.post('/customer/saveDefeatCustomer',{storeId:storeId,contactWay:contactWay})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //bsp战败潜客生成bip潜客
        this.addCustomer = function(customerInfo){
            var deferred = $q.defer();
            $http.post('/customer/addCustomer',{customerInfo:JSON.stringify(customerInfo),generateCustomerFlag:1})
                // $http.get('pcList.json')
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
            $http.post('/user/selectUserForHolderSearch',{roleId:5})
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