'use strict';
angular.module('myApp')
    .service('reportService', ['$http','$q', function($http,$q){
        //查询邀约率报表数据
        this.findInviteReportData = function(condition){
            var deferred = $q.defer();
            $http.post('/report/findInviteReportData',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //获取邀约统计报表的查询日期列表
        this.findReportSearchTime = function(condition){
            var deferred = $q.defer();
            $http.post('/report/findReportSearchTime',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //查询邀约率报表-到店率数据
        this.findComeStoreReportData = function(condition){
            var deferred = $q.defer();
            $http.post('/report/findComeStoreReportData',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //查询全部客户统计报表
        this.findCustomerHolder = function(searchTime,roleId){
            var deferred = $q.defer();
            $http.post('/report/findCustomerHolder',{searchTime:searchTime,roleId:roleId})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //查询保险公司业务占比数据
        this.countInsuranceBill = function(condition){
            var deferred = $q.defer();
            $http.post('/report/countInsuranceBill',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //查询当期续保率数据
        this.xbltjbbDqxbl = function(condition){
            var deferred = $q.defer();
            $http.post('/report/xbltjbbDqxbl',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //查询当期续保率数据(趋势图)
        this.searchDqxblqs = function(condition){
            var deferred = $q.defer();
            $http.post('/report/xbltjbbDqxbl_qushi',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //查询综合续保率数据
        this.xbltjbbZhxbl = function(condition){
            var deferred = $q.defer();
            $http.post('/report/xbltjbbZhxbl',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //查询综合续保率数据(趋势图)
        this.searchZhxblqs = function(condition){
            var deferred = $q.defer();
            $http.post('/report/xbltjbbZhxbl_qushi',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //查询失销原因统计报表
        this.findLossReasonCount = function(startTime,endTime){
            var deferred = $q.defer();
            $http.post('/report/findLossReasonCount',{startTime:startTime,endTime:endTime})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //查询回退原因统计报表
        this.findReturnReasonCount = function(startTime,endTime){
            var deferred = $q.defer();
            $http.post('/report/findReturnReasonCount',{startTime:startTime,endTime:endTime})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //查询跟踪统计数据
        this.traceCount = function(condition){
            var deferred = $q.defer();
            $http.post('/report/traceCount',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //查询邀约和到店统计数据
        this.inviteComestore = function(condition){
            var deferred = $q.defer();
            $http.post('/report/inviteComestore',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //查询出单统计数据
        this.insurancebillCount = function(condition){
            var deferred = $q.defer();
            $http.post('/report/insurancebillCount',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //保险KPI日报-续保专员
        this.countXbzyKPI = function(condition){
            var deferred = $q.defer();
            $http.post('/report/countXbzyKPI',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //保险KPI日报-销售顾问
        this.countXsgwKPI = function(condition){
            var deferred = $q.defer();
            $http.post('/report/countXsgwKPI',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //保险KPI日报-服务顾问
        this.countFwgwKPI = function(condition){
            var deferred = $q.defer();
            $http.post('/report/countFwgwKPI',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //保险KPI日报-出单员
        this.countCdyKPI = function(condition){
            var deferred = $q.defer();
            $http.post('/report/countCdyKPI',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //保险KPI日报-续保专员详情
        this.countXbzyKPIDetail = function(condition){
            var deferred = $q.defer();
            $http.post('/report/countXbzyKPIDetail',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //保险KPI日报-分续保类型
        this.countXbzyKPICoverType = function(condition){
            var deferred = $q.defer();
            $http.post('/report/countXbzyKPICoverType',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //保险KPI月报-分续保专员
        this.findCountMonthKpiXbzy = function(condition){
            var deferred = $q.defer();
            $http.post('/report/findCountMonthKpiXbzy',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //保险KPI月报-分出单员
        this.findCountMonthKpiCdy = function(condition){
            var deferred = $q.defer();
            $http.post('/report/findCountMonthKpiCdy',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //保险KPI月报-续保专员详情
        this.findCountMonthKpiXbzyDetail = function(condition){
            var deferred = $q.defer();
            $http.post('/report/findCountMonthKpiXbzyDetail',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //保险KPI月报-按保险公司
        this.findCountMonthKpiInsurComp = function(condition){
            var deferred = $q.defer();
            $http.post('/report/findCountMonthKpiInsurComp',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //保险KPI月报-按投保类型
        this.findCountMonthKpiCoverType = function(condition){
            var deferred = $q.defer();
            $http.post('/report/findCountMonthKpiCoverType',{condition:JSON.stringify(condition)})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //续保专员客户流转报表
        this.findCustomerTrendData = function(recordTime){
            var deferred = $q.defer();
            $http.post('/report/findCustomerTrendData',{recordTime:recordTime})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //续保专员客户流转报表明细查询
        this.findCustomerTrendDetail = function(recordTime,stackName,userId,startNum){
            var deferred = $q.defer();
            $http.post('/report/findCustomerTrendDetail',{recordTime:recordTime,stackName:stackName,userId:userId,startNum:startNum})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

        //查询异常数据报表
        this.findExceptionData = function(recordTime,roleId){
            var deferred = $q.defer();
            $http.post('/report/findExceptionData',{recordTime:recordTime,roleId:roleId})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };
        //查询异常数据报表明细
        this.findExceptionDataDetail = function(recordTime,stackName,userId,startNum){
            var deferred = $q.defer();
            $http.post('/report/findExceptionDataDetail',{recordTime:recordTime,stackName:stackName,userId:userId,startNum:startNum})
                .success(function(result){
                    deferred.resolve(result);
                })
                .error(function(result){
                    deferred.reject(result);
                });
            return deferred.promise;
        };

    }]);