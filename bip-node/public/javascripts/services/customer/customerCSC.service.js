'use strict';
angular.module('myApp')
    .service('customerCSCService', ['$http','$q', function($http,$q){

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

        //唤醒
        this.wakeUpCustomer = function(customerId,principalId,principal,hxyy){
            var deferred = $q.defer();
            $http.post('/customer/wakeUpCustomer',{customerId:customerId,principalId:principalId,principal:principal,hxyy:hxyy})

                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //失销
        this.lostSale = function(customerId,principalId,principal,sxyy,sxyyxz){
            var deferred = $q.defer();
            $http.post('/customer/lostSale',{customerId:customerId,principalId:principalId,principal:principal,sxyy:sxyy,sxyyxz:sxyyxz})

                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //睡眠
        this.customerSleep = function(customerId,principalId,principal,smyy){
            var deferred = $q.defer();
            $http.post('/customer/customerSleep',{customerId:customerId,principalId:principalId,principal:principal,smyy:smyy})

                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //更新接收状态(批量)
        this.updateAcceptStatuBatch = function(customerInfo){
            var deferred = $q.defer();
            $http.post('/customer/updateCseAcceptStatuBatch',{customerInfo:JSON.stringify(customerInfo)})
                // $http.get('pcList.json')
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

        //更新潜客信息
        this.updateCustomerInfo = function(customer,principalId,principal){
            var deferred = $q.defer();
            $http.post('/customer/updateCustomerInfo',{customer:JSON.stringify(customer),principalId:principalId,principal:principal})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //激活潜客
        this.activateCustomer = function(customerId,principalId,principal,jhyy){
            var deferred = $q.defer();
            $http.post('/customer/activateCustomer',{customerId:customerId,principalId:principalId,principal:principal,jhyy:jhyy})
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
            var contactWay = obj.contactWay;
            $http.post('/customer/saveDefeatCustomer',{contactWay:contactWay})
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

        this.getMessage = function(obj){
            var deferred = $q.defer();
            $http.post('/customer/getMessage',{"customerId":obj})
                // $http.get('pcList.json')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //客服统计查询
        this.findCSCUserStatistics = function(startDate,endDate,showAll){
            var deferred = $q.defer();
            $http.post('/statistic/findCSCUserStatistics',{startDate:startDate,endDate:endDate,showAll:showAll})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //根据建档人id查询潜客
        this.findCustomerByCreater = function(short,shortmain,startNum,renewalType,chassisNumber,carLicenseNumber,contact,contactWay){
            var deferred = $q.defer();
            $http.post('/customer/findCustomerByCreater',{short:short,shortmain:shortmain,startNum:startNum,renewalType:renewalType,chassisNumber:chassisNumber,carLicenseNumber:carLicenseNumber,contact:contact,contactWay:contactWay})
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

        this.getMessageByUC = function(obj){
            var deferred = $q.defer();
            $http.post('/customer/getMessageByUC',{"jqxrqEnd":obj})
                // $http.get('pcList.json')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //批量失销
        this.batchLostSale = function(condition){
            var deferred = $q.defer()
            $http.post('/customer/batchLostSale',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //查询所有失销/回退原因
        this.findForSelectData = function(Data){
            var deferred = $q.defer();
            $http.post('/reason/findForSelectData',{params:JSON.stringify(Data)})
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