/**
 * Created by qiumingyu on 2016/6/3.
 */
var express = require('express');
var router = express.Router();
var reportService = require("../service/reportService");
var web =  require("../common/configure").webConfigure;



//查询邀约率报表-邀约率数据
router.post('/findInviteReportData', function(req, res, next) {
    var condition = req.body.condition;
    var param = {condition:condition}

    reportService.findInviteReportData(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

//获取邀约统计报表的查询日期列表
router.post('/findReportSearchTime', function(req, res, next) {
    var condition = req.body.condition;
    var param = {condition:condition}

    reportService.findReportSearchTime(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

//获取所有潜客持有数数据
router.post('/findCustomerHolder', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var searchTime = req.body.searchTime;
    var roleId = req.body.roleId;
    var storeId = user.store.storeId;

    var param = {searchTime:searchTime,roleId:roleId,storeId:storeId}

    reportService.findCustomerHolder(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

//查询邀约率报表-到店率数据
router.post('/findComeStoreReportData', function(req, res, next) {
    var condition = req.body.condition;
    var param = {condition:condition}

    reportService.findComeStoreReportData(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

//查询保险公司业务占比数据
router.post('/countInsuranceBill', function(req, res, next) {
    var condition = req.body.condition;
    var param = {condition:condition};

    reportService.countInsuranceBill(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});
//查询当期续保率数据
router.post('/xbltjbbDqxbl', function(req, res, next) {
    var condition = req.body.condition;
    var param = {condition:condition};

    reportService.xbltjbbDqxbl(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});
//查询综合续保率数据
router.post('/xbltjbbZhxbl', function(req, res, next) {
    var condition = req.body.condition;
    var param = {condition:condition};

    reportService.xbltjbbZhxbl(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});
//获取回退原因统计数据
router.post('/findReturnReasonCount', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var startTime = req.body.startTime;
    var endTime = req.body.endTime;
    var storeId = user.store.storeId;

    var param = {startTime:startTime,endTime:endTime,storeId:storeId}

    reportService.findReturnReasonCount(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

//获取失销原因统计数据
router.post('/findLossReasonCount', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var startTime = req.body.startTime;
    var endTime = req.body.endTime;
    var storeId = user.store.storeId;

    var param = {startTime:startTime,endTime:endTime,storeId:storeId}

    reportService.findLossReasonCount(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

//统计跟踪次数和发起邀约次数(日报)
router.post('/findTraceCountByDay', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var searchTime = req.body.searchTime;
    var storeId = user.store.storeId;

    var param = {searchTime:searchTime,storeId:storeId}

    reportService.findTraceCountByDay(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});
//统计邀约和到店人数(日报)
router.post('/findInviteAndComeStoreByDay', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var searchTime = req.body.searchTime;
    var storeId = user.store.storeId;

    var param = {searchTime:searchTime,storeId:storeId}

    reportService.findInviteAndComeStoreByDay(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});
//查询跟踪统计数据
router.post('/traceCount', function(req, res, next) {
    var condition = req.body.condition;
    var param = {condition:condition};

    reportService.traceCount(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});
//查询邀约和到店统计数据
router.post('/inviteComestore', function(req, res, next) {
    var condition = req.body.condition;
    var param = {condition:condition};

    reportService.inviteComestore(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});
//查询出单统计数据
router.post('/insurancebillCount', function(req, res, next) {
    var condition = req.body.condition;
    var param = {condition:condition};

    reportService.insurancebillCount(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

//APP日报分保险公司
router.post('/appInsurancebillCount', function(req, res, next) {
    var condition = req.body.condition;
    var param = {condition:condition};

    reportService.appInsurancebillCount(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

//保险KPI日报-续保专员
router.post('/countXbzyKPI', function(req, res, next) {
    var condition = req.body.condition;
    var param = {condition:condition};

    reportService.countXbzyKPI(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});
//保险KPI日报-销售顾问
router.post('/countXsgwKPI', function(req, res, next) {
    var condition = req.body.condition;
    var param = {condition:condition};

    reportService.countXsgwKPI(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});
//保险KPI日报-服务顾问
router.post('/countFwgwKPI', function(req, res, next) {
    var condition = req.body.condition;
    var param = {condition:condition};

    reportService.countFwgwKPI(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});
//保险KPI日报-出单员
router.post('/countCdyKPI', function(req, res, next) {
    var condition = req.body.condition;
    var param = {condition:condition};

    reportService.countCdyKPI(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});
//保险KPI日报-续保专员详情
router.post('/countXbzyKPIDetail', function(req, res, next) {
    var condition = req.body.condition;
    var param = {condition:condition};

    reportService.countXbzyKPIDetail(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});
//保险KPI日报-分续保类型
router.post('/countXbzyKPICoverType', function(req, res, next) {
    var condition = req.body.condition;
    var param = {condition:condition};

    reportService.countXbzyKPICoverType(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

//保险KPI月报-分续保专员
router.post('/findCountMonthKpiXbzy', function(req, res, next) {
    var condition = req.body.condition;
    var param = {condition:condition};

    reportService.findCountMonthKpiXbzy(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

//保险KPI月报-分出单员
router.post('/findCountMonthKpiCdy', function(req, res, next) {
    var condition = req.body.condition;
    var param = {condition:condition};

    reportService.findCountMonthKpiCdy(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

//保险KPI月报-续保专员详情
router.post('/findCountMonthKpiXbzyDetail', function(req, res, next) {
    var condition = req.body.condition;
    var param = {condition:condition};

    reportService.findCountMonthKpiXbzyDetail(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

//保险KPI月报-按保险公司
router.post('/findCountMonthKpiInsurComp', function(req, res, next) {
    var condition = req.body.condition;
    var param = {condition:condition};

    reportService.findCountMonthKpiInsurComp(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

//保险KPI月报-按投保类型
router.post('/findCountMonthKpiCoverType', function(req, res, next) {
    var condition = req.body.condition;
    var param = {condition:condition};

    reportService.findCountMonthKpiCoverType(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

//APP月报-当期续保数
router.post('/findCountAppMonthDqxbs', function(req, res, next) {
    var condition = req.body.condition;
    var param = {condition:condition};

    reportService.findCountAppMonthDqxbs(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

//APP月报-综合续保数
router.post('/findCountAppMonthZhxbs', function(req, res, next) {
    var condition = req.body.condition;
    var param = {condition:condition};

    reportService.findCountAppMonthZhxbs(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

//续保专员客户流转报表
router.post('/findCustomerTrendData', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var recordTime = req.body.recordTime;
    var storeId = user.store.storeId;

    var param = {recordTime:recordTime,storeId:storeId}

    reportService.findCustomerTrendData(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});
//续保专员客户流转报表明细查询
router.post('/findCustomerTrendDetail', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var recordTime = req.body.recordTime;
    var userId = req.body.userId;
    var stackName = req.body.stackName;
    var storeId = user.store.storeId;
    var startNum = req.body.startNum;
    
    var param = {recordTime:recordTime,storeId:storeId,stackName:stackName,userId:userId,startNum:startNum}

    reportService.findCustomerTrendDetail(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});
/**
 * 查询当期续保率数据(趋势图)
 */
router.post('/xbltjbbDqxbl_qushi', function(req, res, next) {
    var condition = req.body.condition;
    var param = {condition:condition};

    reportService.xbltjbbDqxbl_qushi(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

/**
 * 查询综合续保率数据(趋势图)
 */
router.post('/xbltjbbZhxbl_qushi', function(req, res, next) {
    var condition = req.body.condition;
    var param = {condition:condition};

    reportService.xbltjbbZhxbl_qushi(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

//查询异常数据报表
router.post('/findExceptionData', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var recordTime = req.body.recordTime;
    var roleId = req.body.roleId;
    var storeId = user.store.storeId;

    var param = {recordTime:recordTime,storeId:storeId,roleId:roleId}

    reportService.findExceptionData(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});
//查询异常数据报表明细
router.post('/findExceptionDataDetail', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var recordTime = req.body.recordTime;
    var userId = req.body.userId;
    var stackName = req.body.stackName;
    var storeId = user.store.storeId;
    var startNum = req.body.startNum;

    var param = {recordTime:recordTime,storeId:storeId,stackName:stackName,userId:userId,startNum:startNum}

    reportService.findExceptionDataDetail(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

module.exports = router;
