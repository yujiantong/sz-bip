var web = require('../common/configure').webConfigure;
var utilBsp = require('../common/utilBsp');
var logger = require('../common/logger').logger;

//查询邀约率报表数据
function  findInviteReportData(param){

    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/report/findInviteReportData", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//获取所有潜客持有数数据
function  findCustomerHolder(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/report/findCustomerHolder", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}


//查询邀约率报表-到店率数据
function  findComeStoreReportData(param){

    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/report/findComeStoreReportData", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//查询保险公司业务占比数据
function  countInsuranceBill(param){

    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/report/countInsuranceBill", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}
//查询当期续保率数据
function  xbltjbbDqxbl(param){

    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/report/xbltjbbDqxbl", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}
//查询综合续保率数据
function  xbltjbbZhxbl(param){

    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/report/xbltjbbZhxbl", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}
//获取回退原因统计数据
function  findReturnReasonCount(param){

    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/report/findReturnReasonCount", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//获取失销原因统计数据
function  findLossReasonCount(param){

    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/report/findLossReasonCount", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//获取邀约统计报表的查询日期列表
function  findReportSearchTime(param){

    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/report/findReportSearchTime", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//统计跟踪次数和发起邀约次数(日报)
function  findTraceCountByDay(param){

    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/report/findTraceCountByDay", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//统计邀约和到店人数(日报)
function  findInviteAndComeStoreByDay(param){

    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/report/findInviteAndComeStoreByDay", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}
//查询跟踪统计数据
function  traceCount(param){

    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/report/traceCount", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//查询邀约和到店统计数据
function  inviteComestore(param){

    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/report/inviteComestore", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}
//查询出单统计数据
function  insurancebillCount(param){

    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/report/findCountDayKpiInsurComp", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//APP日报分保险公司
function appInsurancebillCount(param){

    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/report/appInsurancebillCount", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//保险KPI日报-续保专员
function  countXbzyKPI(param){

    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/report/countXbzyKPI", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//保险KPI日报-销售顾问
function  countXsgwKPI(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/report/countXsgwKPI", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//保险KPI日报-服务顾问
function  countFwgwKPI(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/report/countFwgwKPI", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//保险KPI日报-出单员
function  countCdyKPI(param){

    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/report/countCdyKPI", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//保险KPI日报-续保专员详情
function  countXbzyKPIDetail(param){

    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/report/countXbzyKPIDetail", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//保险KPI日报-分续保类型
function  countXbzyKPICoverType(param){

    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/report/countXbzyKPICoverType", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//保险KPI月报-分续保专员
function  findCountMonthKpiXbzy(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/report/findCountMonthKpiXbzy", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//保险KPI月报-分出单员
function findCountMonthKpiCdy(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/report/findCountMonthKpiCdy", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//保险KPI月报-续保专员详情
function  findCountMonthKpiXbzyDetail(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/report/findCountMonthKpiXbzyDetail", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//保险KPI月报-按保险公司
function  findCountMonthKpiInsurComp(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/report/findCountMonthKpiInsurComp", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//保险KPI月报-按投保类型
function  findCountMonthKpiCoverType(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/report/findCountMonthKpiCoverType", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//APP月报-当期续保数
function  findCountAppMonthDqxbs(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/report/findCountAppMonthDqxbs", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//APP月报-综合续保数
function  findCountAppMonthZhxbs(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/report/findCountAppMonthZhxbs", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//续保专员客户流转报表
function  findCustomerTrendData(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/report/findCustomerTrendData", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//续保专员客户流转报表明细查询
function findCustomerTrendDetail(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/report/findCustomerTrendDetail", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

/**
 *查询当期续保率数据(趋势图)
 * @param param
 */
function  xbltjbbDqxbl_qushi(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/report/xbltjbbDqxbl_qushi", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

/**
 *查询综合续保率数据(趋势图)
 * @param param
 */
function  xbltjbbZhxbl_qushi(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/report/xbltjbbZhxbl_qushi", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//查询异常数据报表
function findExceptionData(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/report/findExceptionData", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//查询异常数据报表明细
function findExceptionDataDetail(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/report/findExceptionDataDetail", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}


exports.findCustomerTrendDetail =findCustomerTrendDetail;
exports.findCustomerTrendData = findCustomerTrendData
exports.findInviteReportData  = findInviteReportData;
exports.findCustomerHolder = findCustomerHolder;
exports.findComeStoreReportData = findComeStoreReportData;
exports.countInsuranceBill = countInsuranceBill;
exports.findReturnReasonCount = findReturnReasonCount;
exports.findLossReasonCount = findLossReasonCount;
exports.findReportSearchTime = findReportSearchTime;
exports.findTraceCountByDay = findTraceCountByDay;
exports.findInviteAndComeStoreByDay = findInviteAndComeStoreByDay;
exports.xbltjbbDqxbl = xbltjbbDqxbl;
exports.xbltjbbZhxbl = xbltjbbZhxbl;
exports.traceCount = traceCount;
exports.inviteComestore = inviteComestore;
exports.insurancebillCount = insurancebillCount;
exports.countXbzyKPI = countXbzyKPI;
exports.countXsgwKPI = countXsgwKPI;
exports.countFwgwKPI = countFwgwKPI;
exports.countCdyKPI = countCdyKPI;
exports.countXbzyKPIDetail = countXbzyKPIDetail;
exports.countXbzyKPICoverType = countXbzyKPICoverType;
exports.appInsurancebillCount =appInsurancebillCount;
exports.findCountMonthKpiCdy =findCountMonthKpiCdy;
exports.findCountMonthKpiXbzy =findCountMonthKpiXbzy;
exports.findCountMonthKpiXbzyDetail = findCountMonthKpiXbzyDetail;
exports.findCountMonthKpiInsurComp = findCountMonthKpiInsurComp;
exports.findCountMonthKpiCoverType = findCountMonthKpiCoverType;
exports.findCountAppMonthDqxbs = findCountAppMonthDqxbs;
exports.findCountAppMonthZhxbs =findCountAppMonthZhxbs;
exports.xbltjbbDqxbl_qushi = xbltjbbDqxbl_qushi;
exports.xbltjbbZhxbl_qushi = xbltjbbZhxbl_qushi;
exports.findExceptionDataDetail =findExceptionDataDetail;
exports.findExceptionData = findExceptionData

