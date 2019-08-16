'use strict';
angular.module('myApp')
    .service('customerSCService', ['$http','$q', function($http,$q){

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
        //添加跟踪信息
        this.addTraceRecord = function(customerTraceRecode,traceFlag,htyy,htyyxz){
            var deferred = $q.defer();
            $http.post('/customer/addTraceRecord',{customerTraceRecode:JSON.stringify(customerTraceRecode),traceFlag:traceFlag,htyy:htyy,htyyxz:htyyxz})
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
        //更新接收状态
        this.updateAcceptStatu = function(customerId,principalId,principal){
            var deferred = $q.defer();
            $http.post('/customer/updateAcceptStatu',{customerId:customerId,principalId:principalId,principal:principal})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //跟踪回退
        this.traceReturn = function(customerId,htyy,principalId,principal){
            var deferred = $q.defer();
            $http.post('/customer/returnBySC',{customerId:customerId,htyy:htyy,principalId:principalId,principal:principal})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //跟踪完成
        this.traceFinishHandle = function(customerId,principalId,principal){
            var deferred = $q.defer();
            $http.post('/customer/traceFinishHandle',{customerId:customerId,principalId:principalId,principal:principal})
                // $http.get('pcList.json')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //销售顾问的销售统计查询
        this.findSCSaleStatistics = function(startDate,endDate,showAll){
            var deferred = $q.defer();
            $http.post('/statistic/findSCSaleStatistics',{startDate:startDate,endDate:endDate,showAll:showAll})
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
            $http.post('/customer/updateConsultantAcceptStatuBatch',{customerInfo:JSON.stringify(customerInfo)})
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

        //根据潜客的级别自动带出下次跟踪日期
        this.setNextTraceDay = function(customerLevel,customerId){
            var deferred = $q.defer();
            $http.post('/customer/setNextTraceDay',{customerLevel : customerLevel,customerId:customerId})
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
        //手动请求壁虎刷新潜客信息
        this.manual = function(condition){
            var deferred = $q.defer();
            $http.post('/customer/manual',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //壁虎报价
        this.bihuApplyBJ = function(condition){
            var deferred = $q.defer();
            //$http.get("./js/test.json")
            $http.post('/bihu/applyBJ',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        this.bihuSaveBJ = function(condition){
            var deferred = $q.defer();
            $http.post(' /bihu/saveBJ',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //按潜客ID查询该潜客去年险种信息
        this.findBxInfoForBH = function(customerId){
            var deferred = $q.defer();
            $http.post('/customer/findBxInfoForBH',{customerId:customerId})
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
        //根据customerId查询潜客跟踪次数
        this.findGzCount = function(customerId){
            var deferred = $q.defer();
            $http.post('/customer/findGzCount',{customerId:customerId})
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
        //用bofide提供的接口报价
        this.applyBJFromBofide = function(condition){
            var deferred = $q.defer();
            $http.post('/bihu/applyBJFromBofide',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //查询品牌型号
        this.getModels = function(condition){
            var deferred = $q.defer();
            $http.post('/bihu/getModels',{condition:JSON.stringify(condition)})
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