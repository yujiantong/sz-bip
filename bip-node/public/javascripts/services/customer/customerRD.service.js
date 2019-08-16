'use strict';
angular.module('myApp')
    .service('customerRDService', ['$http','$q', function($http,$q){
        //查询邀约信息
        this.findByInviteStatu = function(condition){
            var deferred = $q.defer();
            $http.post('/customer/findByInviteStatu',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //查询邀约记录
        this.findInviteStatuRD = function(condition){
            var deferred = $q.defer();
            $http.post('/customer/findInviteStatuRD',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //查询邀约潜客跟踪记录
        this.findByInviteStatuGzjl = function(condition){
            var deferred = $q.defer();
            $http.post('/customer/findByInviteStatuGzjl',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

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
        //根据跟踪状态查询潜客跟踪记录
        this.findByTraceStatuGzjl = function(condition){
            var deferred = $q.defer();
            $http.post('/customer/findByTraceStatuGzjl',{condition:JSON.stringify(condition)})
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
        //根据保单日期状态查询潜客跟踪记录
        this.findByCusLostInsurStatuGzjl = function(condition){
            var deferred = $q.defer();
            $http.post('/customer/findByCusLostInsurStatuGzjl',{condition:JSON.stringify(condition)})
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
        //根据接收状态查询跟踪记录
        this.findByAcceptStatuGzjl = function(condition){
            var deferred = $q.defer();
            $http.post('/customer/findByAcceptStatuGzjl',{condition:JSON.stringify(condition)})
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
        //根据回退状态查询跟踪记录
        this.findByReturnStatuGzjl = function(condition){
            var deferred = $q.defer();
            $http.post('/customer/findByReturnStatuGzjl',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //待审批状态查询
        this.findByApprovalStatu = function(condition){

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
        //待审批状态查询
        this.findByApprovalStatuGzjl = function(condition){

            var deferred = $q.defer();
            $http.post('/customer/findByApprovalGzjl',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };


        //查询已经唤醒的潜客
        this.findActivateCustomer = function(condition){
            var deferred = $q.defer();
            $http.post('/customer/findActivateCustomer',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //查询已经唤醒的潜客跟踪记录
        this.findActivateCustomerGzjl = function(condition){
            var deferred = $q.defer();
            $http.post('/customer/findActivateCustomerGzjl',{condition:JSON.stringify(condition)})
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
            $http.post('/insurance/findCustByCondition',{searchDatas:JSON.stringify(searchDatas)})
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
        this.findByConditionGzjl = function(searchDatas){
            var deferred = $q.defer();
            $http.post('/customer/findCustByConditionGzjl',{searchDatas:JSON.stringify(searchDatas)})
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

        //续保主管同意回退
        this.traceReturn = function(customerId,principalId,principal,tyhtyj){
            var deferred = $q.defer();
            $http.post('/customer/traceReturnXbzg',{customerId:customerId,principalId:principalId,principal:principal,tyhtyj:tyhtyj})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //更新负责人
        this.replacePrincipal = function(customerId,newPrincipalId,newPrincipal,principalId,principal,ghfzryy){
            var deferred = $q.defer();
            $http.post('/customer/changePrincipal',{customerId:customerId,newPrincipalId:newPrincipalId,newPrincipal:newPrincipal,
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

        //指定负责人
        this.assignPrincipal = function(customerId,newPrincipalId,principal,principalId,ghfzryy){
            var deferred = $q.defer();
            $http.post('/customer/assignPrincipal',{customerId:customerId,newPrincipalId:newPrincipalId,principal:principal,
                    principalId:principalId,ghfzryy:ghfzryy})
                // $http.get('pcList.json')
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
        //延期审批时,更新回退状态为已延期状态,更新延期到期日为当前时间加 7天
        this.updateReturnStatuToYyq = function(customerId,principalId,principal,tyyqyj){
            var deferred = $q.defer();
            $http.post('/customer/updateReturnStatuToYyq',{customerId:customerId,principalId:principalId,principal:principal,tyyqyj:tyyqyj})

                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //直接延期,更新延期到期日为当前时间加 7天
        this.updateReturnStatuByRD = function(customerId,principalId,principal,yqyy){
            var deferred = $q.defer();
            $http.post('/customer/updateReturnStatuByRD',{customerId:customerId,principalId:principalId,principal:principal,yqyy:yqyy})

                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //续保主管不同意回退
        this.unAgreeTraceReturnXbzg = function(customerId,principalId,principal,jjhtyy){
            var deferred = $q.defer();
            $http.post('/customer/unAgreeTraceReturnXbzg',{customerId:customerId,principalId:principalId,principal:principal,jjhtyy:jjhtyy})

                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //续保主管自动回退
        this.activeReturn = function(customerId,principalId,principal,zdhtyy){
            var deferred = $q.defer();
            $http.post('/customer/activeReturn',{customerId:customerId,principalId:principalId,principal:principal,zdhtyy:zdhtyy})

                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //续保主管不同意延期
        this.updateReturnStatuToCszt = function(customerId,principalId,principal,jjyqyy){
            var deferred = $q.defer();
            $http.post('/customer/updateReturnStatuToCszt',{customerId:customerId,principalId:principalId,principal:principal,jjyqyy:jjyqyy})

                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //保险统计查询
        this.findInsuranceStatistics = function(startDate,endDate,showAll){
            var deferred = $q.defer();
            $http.post('/statistic/findInsuranceStatistics',{startDate:startDate,endDate:endDate,showAll:showAll})
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

        //售后统计查询
        this.findServiceStatistics = function(startDate,endDate,showAll){
            var deferred = $q.defer();
            $http.post('/statistic/findServiceStatistics',{startDate:startDate,endDate:endDate,showAll:showAll})
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
        //出单员统计查询
        this.findIWStatistics = function(startDate,endDate,showAll){
            var deferred = $q.defer();
            $http.post('/statistic/findIWStatistics',{startDate:startDate,endDate:endDate,showAll:showAll})
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
        //查询建档人
        this.selectUserForJdrDataSource = function(){
            var deferred = $q.defer();
            $http.post('/user/selectUserForJdrDataSource')
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
        this.updateCustomerInfo = function(customer,principalId,principal,holderId){
            var deferred = $q.defer();
            $http.post('/customer/updateCustomerInfo',{customer:JSON.stringify(customer),principalId:principalId,principal:principal,holderId:holderId})
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
        //睡眠
        this.customerSleep = function(customerId,principalId,principal,smyy){
            var deferred = $q.defer();
            $http.post('/customer/customerSleepByRD',{customerId:customerId,principalId:principalId,principal:principal,smyy:smyy})

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
            $http.post('/user/selectUserForHolderSearch')
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
            $http.post('/customer/changePrincipalBatchRD',{data:JSON.stringify(data)})
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
        //新增报价记录
        this.addCustomerBJRecode = function(customerBJRecode){
            var deferred = $q.defer();
            $http.post('/customer/addCustomerBJRecode',{customerBJRecode:JSON.stringify(customerBJRecode)})
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
        //查询已激活的潜客
        this.findByJiHuo = function(condition){
            var deferred = $q.defer();
            $http.post('/customer/findByJiHuo',{condition:JSON.stringify(condition)})
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
        //取消睡眠
        this.saveCancelSleep = function(customerId,principalId,principal,jqxrqEnd){
            var deferred = $q.defer();
            $http.post('/customer/saveCancelSleep',{customerId:customerId,principalId:principalId,principal:principal,jqxrqEnd:jqxrqEnd})
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
        //模块开启设置查询
        this.moduleSearch = function(){
            var deferred = $q.defer();
            $http.post('/setting/findModuleSet')
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
        //批量睡眠
        this.sleepBatchXBZG = function (condition) {
            var deferred = $q.defer()
            $http.post('/customer/sleepBatchXBZG',{condition:JSON.stringify(condition)})
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
        //续保主管失销
        this.lostByXbzg = function(customerId,principalId,principal,sxyy,sxyyxz){
            var deferred = $q.defer();
            $http.post('/customer/lostByXbzg',{customerId:customerId,principalId:principalId,principal:principal,sxyy:sxyy,sxyyxz:sxyyxz})

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
    }]);