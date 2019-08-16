'use strict';
angular.module('myApp')
    .service('customerIWService', ['$http','$q', function($http,$q){
        //查询邀约信息
        //this.solicitation = function(condition){
        //    var deferred = $q.defer();
        //    $http.post('/insurance/findInvitedCust',{condition:JSON.stringify(condition)})
        //        .success(function(result){
        //            deferred.resolve(result);
        //        })
        //        .error(function(result){
        //            deferred.reject(result);
        //        });
        //    return deferred.promise;
        //};

        //查询邀约记录
        this.findInviteStatuIW = function(condition){
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

        //跟踪处理 根据查潜客Id查询潜客跟踪信息
        this.getCustById = function(customerId){
            var deferred = $q.defer();
            $http.get('/customer/findByCustomerId?customerId='+customerId)
                // $http.get('pcList.json')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //提交新增潜客信息
        this.addCustomer = function(customerInfo){
            var deferred = $q.defer();
            $http.post('/customer/addCustomer',{customerInfo:JSON.stringify(customerInfo)})
                // $http.get('pcList.json')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //确认邀约到店
        this.confirmIntoStore = function(customerId,principalId,principal,holderId){
            var deferred = $q.defer();
            $http.post('/insurance/confirmIntoStore',{customerId:customerId,principalId:principalId,principal:principal,holderId:holderId})
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
        //审批单打印
        this.print_spd_submit = function(print_spd_datas,flag, insuredQuota){
            if(print_spd_datas.approvalBill.insurancTypes && verificationInsuranceType(print_spd_datas.approvalBill.insurancTypes)){
                var insuranceTypeArr = print_spd_datas.approvalBill.insurancTypes.split(",");
                var insurancTypes = "";
                for(var i = 0; i<insuranceTypeArr.length; i++){
                    insurancTypes += insuranceTypeArr[i] ;
                    if(insuranceTypeArr[i].indexOf("车损") > -1 && insuredQuota.cheSun){
                        insurancTypes += "-" + insuredQuota.cheSun;
                    }
                    if(insuranceTypeArr[i].indexOf("三者") > -1 && insuredQuota.sanZhe){
                        insurancTypes += "-" + insuredQuota.sanZhe;

                    }
                    if(insuranceTypeArr[i].indexOf("司机") > -1 && insuredQuota.siJi ){
                        insurancTypes += "-" + insuredQuota.siJi;

                    }
                    if(insuranceTypeArr[i].indexOf("乘客") > -1 && insuredQuota.chengKe ){
                        insurancTypes += "-" + insuredQuota.chengKe;

                    }
                    if(insuranceTypeArr[i].indexOf("划痕") > -1 && insuredQuota.huaHen ){
                        insurancTypes += "-" + insuredQuota.huaHen;

                    }
                    if(insuranceTypeArr[i].indexOf("玻璃") > -1 && insuredQuota.boLi ){
                        insurancTypes += "-" + insuredQuota.boLi;

                    }
                    if(insuranceTypeArr[i].indexOf("货物") > -1 && insuredQuota.huoWu){
                        insurancTypes += "-" + insuredQuota.huoWu;

                    }
                    if(insuranceTypeArr[i].indexOf("精神") > -1 && insuredQuota.jingShenSunShi ){
                        insurancTypes += "-" + insuredQuota.jingShenSunShi;

                    }
                    if(insuranceTypeArr[i].indexOf("费用补偿") > -1 && insuredQuota.feiYongBuChang){
                        insurancTypes +=  "-" + insuredQuota.feiYongBuChang;

                    }
                    if(insuranceTypeArr[i].indexOf("指定") > -1 && insuredQuota.zhiDingXiuLi ){
                        insurancTypes += "-" + insuredQuota.zhiDingXiuLi;

                    }
                    insurancTypes += "," ;
                }
                print_spd_datas.approvalBill.insurancTypes = insurancTypes.substr(0 , insurancTypes.length-1)
            }
            var deferred = $q.defer();
            $http.post('/insurance/print_spd',{print_spd_datas:JSON.stringify(print_spd_datas),flag:flag})
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
        //根据回退状态查询
        this.findModuleSet = function(startTime,endTime,returnStatu,startNum,showAll){
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

        //激活
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

        //根据赠品编码或者名称自动联想查询赠品
        this.findGiftByCodeOrName = function(searchCondition,giftType){
            var deferred = $q.defer();
            $http.post('/gift/findGiftByCodeOrName',{searchCondition:searchCondition,giftType:giftType})
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
        function verificationInsuranceType(insuranceType) {
            if(insuranceType.indexOf("车损") > -1 ){
                return true;
            }
            if(insuranceType.indexOf("三者") > -1 ){
                return true;

            }
            if(insuranceType.indexOf("司机") > -1 ){
                return true;
            }
            if(insuranceType.indexOf("乘客") > -1 ){
                return true;
            }
            if(insuranceType.indexOf("划痕") > -1 ){
                return true;
            }
            if(insuranceType.indexOf("玻璃") > -1 ){
                return true;
            }
            if(insuranceType.indexOf("货物") > -1 ){
                return true;
            }
            if(insuranceType.indexOf("精神") > -1 ){
                return true;
            }
            if(insuranceType.indexOf("费用补偿") > -1 ){
                return true;
            }
            if(insuranceType.indexOf("指定") > -1 ){
                return true;
            }
            return false;

        }
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



