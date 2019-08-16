'use strict';
angular.module('myApp')
    .service('customerRCService', ['$http','$q', function($http,$q){
        //查询邀约信息
        //this.findByInviteStatu = function(condition){
        //    var deferred = $q.defer();
        //    $http.post('/customer/findByInviteStatu',{condition:JSON.stringify(condition)})
        //        .success(function(result){
        //            deferred.resolve(result);
        //        })
        //        .error(function(result){
        //            deferred.reject(result);
        //        });
        //    return deferred.promise;
        //};

        //查询邀约记录
        this.findInviteStatuRC = function(condition){
            var deferred = $q.defer();
            $http.post('/customer/findInviteStatuRC',{condition:JSON.stringify(condition)})
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
        this.addTraceRecord = function(customerTraceRecode,traceFlag,htyy,htyyxz,applyStatu){
            var deferred = $q.defer();
            $http.post('/customer/addTraceRecord',{customerTraceRecode:JSON.stringify(customerTraceRecode),traceFlag:traceFlag,htyy:htyy,htyyxz:htyyxz,applyStatu:applyStatu})
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
        this.updateAcceptStatus = function(customerId,principalId,principal){
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
        //续保专员跟踪删除邀约
        this.deleteInvite = function(customerTraceId,scyyyy,customerId,principalId,principal){
            var deferred = $q.defer();
            $http.post('/customer/deleteInvite',{customerTraceId:customerTraceId,scyyyy:scyyyy,customerId:customerId,principalId:principalId,principal:principal})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //续保专员跟踪回退
        this.traceReturn = function(customerId,htyy,principalId,principal,htyyxz,applyStatu){
            var deferred = $q.defer();
            $http.post('/customer/traceReturn',{customerId:customerId,htyy:htyy,principalId:principalId,principal:principal,htyyxz:htyyxz,applyStatu:applyStatu})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //提交新增潜客信息
        this.addCustomer = function(customerInfo,generateCustomerFlag){
            var deferred = $q.defer();
            $http.post('/customer/addCustomer',{customerInfo:JSON.stringify(customerInfo),generateCustomerFlag:generateCustomerFlag})
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
        //申请延期
        this.updateReturnStatuToDyq = function(customerId,yqyy,principalId,principal,applyDelayDay){
            var deferred = $q.defer();
            $http.post('/customer/updateReturnStatuToDyq',{customerId:customerId,yqyy:yqyy,principalId:principalId,principal:principal,applyDelayDay:applyDelayDay})

                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //保险统计查询
        this.findRCInsuranceStatistics = function(startDate,endDate,showAll){
            var deferred = $q.defer();
            $http.post('/statistic/findRCInsuranceStatistics',{startDate:startDate,endDate:endDate,showAll:showAll})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //续保专员更新接收状态(批量)
        this.updateAcceptStatuBatch = function(customerInfo){
            var deferred = $q.defer();
            $http.post('/customer/updateAcceptStatuBatch',{customerInfo:JSON.stringify(customerInfo)})
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
        //手动请求壁虎刷新潜客信息,修改潜客
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
        //手动请求壁虎刷新潜客信息，新增潜客
        this.newCover = function(carLicenseNumber,chassisNumber,engineNumber,flag,certificateNumber){
            var deferred = $q.defer();
            $http.post('/customer/newCover',{carLicenseNumber:carLicenseNumber,chassisNumber:chassisNumber,
                engineNumber:engineNumber,flag:flag,certificateNumber:certificateNumber})
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

        //根据建档人id查询潜客
        this.findCustomerByCreater = function(short,shortmain,startNum,renewalType,chassisNumber,carLicenseNumber,contact,contactWay,startDate,endDate,defeatFlag){
            var deferred = $q.defer();
            $http.post('/customer/findCustomerByCreater',{short:short,shortmain:shortmain,startNum:startNum,renewalType:renewalType,chassisNumber:chassisNumber,carLicenseNumber:carLicenseNumber,
                contact:contact,contactWay:contactWay,startDate:startDate,endDate:endDate,defeatFlag:defeatFlag})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //验证车架号是否重复
        this.yzChaNum = function(condition){
            var deferred = $q.defer();
            $http.post('/customer/yzChaNum',{condition:JSON.stringify(condition)})
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
        //发送短信
        this.sendMessage = function(customerId,phone,content,contact,principalId,principal,nicheng,sendWay){
            var deferred = $q.defer();
            $http.post('/message/sendMessage',{customerId:customerId,phone:phone,content:content,
                contact:contact,principalId:principalId,principal:principal,nicheng:nicheng,sendWay:sendWay})
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
        //根据customerId和dcbjrq查询报价信息
        this.findBJListByCustomerId = function(condition){
            var deferred = $q.defer();
            $http.post('/customer/findBJListByCustomerId',{condition:JSON.stringify(condition)})
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
        //用bofide提供的接口核保
        this.checkInsurance = function(condition){
            var deferred = $q.defer();
            $http.post('/bihu/checkInsurance',{condition:JSON.stringify(condition)})
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
        //续保专员撤销回退，失销，睡眠
        this.cancelReturn = function(condition){
            var deferred = $q.defer();
            $http.post('/customer/cancelReturn',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
    }]);