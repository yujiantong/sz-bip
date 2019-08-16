'use strict';
angular.module('myApp')
    .service('policyRDService', ['$http','$q', function($http,$q){
        //按承保类型查询保单信息
        this.getSingleAll = function(coverType,startTime,endTime,startNum,showAll,short,shortmain){
            var deferred = $q.defer();
            $http.post('/insurance/findByCovertypeAndCdrq',{coverType:coverType,startTime:startTime,endTime:endTime,
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
            $http.post('/insurance/findByMoreCondition',{condition:JSON.stringify(searchDatas),startNum:startNum})
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
        //修改保单信息
        this.updateInsuSingle = function(insuranceBill,insuTypes,insuredQuota){
           // console.log("输出参数 " + JSON.stringify(insuranceBill.insuranceType) + " " + JSON.stringify(insuredQuota))
            if(insuranceBill.insuranceType && verificationInsuranceType(insuranceBill.insuranceType)){
                var insuranceType = insuranceBill.insuranceType.split(",");
                var insuranceTypes = "";

                for(var i = 0; i<insuranceType.length; i++){
                    insuranceTypes += insuranceType[i] ;
                    if(insuranceType[i].indexOf("车损") > -1 && insuredQuota.cheSun){
                        insuranceTypes += "-" + insuredQuota.cheSun;
                    }
                    if(insuranceType[i].indexOf("三者") > -1 && insuredQuota.sanZhe){
                        insuranceTypes += "-" + insuredQuota.sanZhe;

                    }
                    if(insuranceType[i].indexOf("司机") > -1 && insuredQuota.siJi ){
                        insuranceTypes += "-" + insuredQuota.siJi;

                    }
                    if(insuranceType[i].indexOf("乘客") > -1 && insuredQuota.chengKe ){
                        insuranceTypes += "-" + insuredQuota.chengKe;

                    }
                    if(insuranceType[i].indexOf("划痕") > -1 && insuredQuota.huaHen ){
                        insuranceTypes += "-" + insuredQuota.huaHen;

                    }
                    if(insuranceType[i].indexOf("玻璃") > -1 && insuredQuota.boLi ){
                        insuranceTypes += "-" + insuredQuota.boLi;

                    }
                    if(insuranceType[i].indexOf("货物") > -1 && insuredQuota.huoWu){
                        insuranceTypes += "-" + insuredQuota.huoWu;

                    }
                    if(insuranceType[i].indexOf("精神") > -1 && insuredQuota.jingShenSunShi ){
                        insuranceTypes += "-" + insuredQuota.jingShenSunShi;

                    }
                    if(insuranceType[i].indexOf("费用补偿") > -1 && insuredQuota.feiYongBuChang){
                        insuranceTypes +=  "-" + insuredQuota.feiYongBuChang;

                    }
                    if(insuranceType[i].indexOf("指定") > -1 && insuredQuota.zhiDingXiuLi ){
                        insuranceTypes += "-" + insuredQuota.zhiDingXiuLi;

                    }
                    insuranceTypes += "," ;
                }
                insuranceBill.insuranceType = insuranceTypes.substr(0 , insuranceTypes.length-1)
                //console.log("insuranceBill ==>" + JSON.stringify(insuranceBill.insuranceType))
            }
            var deferred = $q.defer();
            $http.post('/insurance/updateInsuranceBillInfo',{insuranceBill:JSON.stringify(insuranceBill),insuTypes:JSON.stringify(insuTypes)})
                // $http.get('pcList.json')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //删除保单
        this.deleteBill = function(insuranceBillId){
            var deferred = $q.defer();
            $http.post('/insurance/deleteBill',{insuranceBillId:insuranceBillId})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //按条件查询审批单信息
        this.getSpdByCondition = function(spdDatas,startNum,billFlag,short,shortmain){
            var deferred = $q.defer();
            $http.post('/insurance/findApprovalBillByCondition',{condition:JSON.stringify(spdDatas),startNum:startNum,billFlag:billFlag,short:short,shortmain:shortmain})
                // $http.get('pcList.json')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //按ID查询审批单明细
        this.getSpdById = function(id,billFlag){
            var deferred = $q.defer();
            $http.post('/insurance/findByApprovalBillId',{id:id,billFlag:billFlag})
                // $http.get('pcList.json')
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
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
    }]);