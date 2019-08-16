var express = require('express');
var router = express.Router();
var mobileService = require("../service/mobileService");

/**
 * 查询待回退员工列表
 * param: storeId
 */
router.post('/findDHTWorkCollection',function(req, res, next){
    var params = req.body.params;
    mobileService.findDHTWorkCollection({params:params})
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
                res.json(err);
        })
})

/**
 *根据customerId查询该潜客详情
 * params: customerId
 */
router.post('/findCustomerDetailsByCustomerId',function(req, res, next){
    var params = JSON.parse(req.body.params);
    var customerId = params.customerId;
    var user = JSON.parse(req.cookies.bip_user);
    var roleId = user.role.roleId;
    mobileService.findCustomerDetailsByCustomerId({customerId:customerId,roleId:roleId})
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
})

/**
 * 根据潜客id查询该潜客的所有跟踪记录
 * param: customerId
 */
router.post('/findRecordByCustomerId',function(req, res, next){
    var params = req.body.params;
    mobileService.findRecordByCustomerId({params:params})
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
})


/**
 * 查询回退待审批对应员工的潜客列表
 * param: userId
 */
router.post('/findReturnApprovalCustomer',function(req, res, next){
    var params = req.body.params;
    mobileService.findReturnApprovalCustomer({params:params})
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
})

/**
 * 根据潜客id查询该潜客的所有报价记录
 * param: customerId
 */
router.post('/findBjRecordByCustomerId',function(req, res, next){
    var params = JSON.parse(req.body.params);
    var customerId = params.customerId;
    mobileService.findBjRecordByCustomerId({customerId:customerId})
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
})

//查询未接受员工列表
router.post('/findWJSWorkCollection',function(req, res, next){
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    var roleId = user.role.roleId;
    var params = {storeId:storeId,roleId:roleId};
    mobileService.findWJSWorkCollection(params)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
})

/**
 * 查询未接受对应员工的潜客列表
 * param: userId
 */
router.post('/findWJSCustomer',function(req, res, next){
    var params = req.body.params;
    mobileService.findWJSCustomer({params:params})
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
})

//查询应跟踪员工列表
router.post('/findYGZWorkCollection',function(req, res, next){
    var traceStatu = req.body.traceStatu;
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    var roleId = user.role.roleId;
    var params = {storeId:storeId,roleId:roleId,traceStatu:traceStatu};
    mobileService.findYGZWorkCollection(params)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
})

/**
 * 查询应跟踪对应员工的潜客列表
 * param: userId,currentPage
 */
router.post('/findYGZCustomer',function(req, res, next){
    var params = req.body.params;
    mobileService.findYGZCustomer({params:params})
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
})

//查询今日邀约员工列表
router.post('/findJRYYWorkerCollection',function(req, res, next){
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    var params = {storeId:storeId};
    mobileService.findJRYYWorkerCollection(params)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
})

//查询今日邀约潜客列表
router.post('/findJRYYCustomerCollectionByUserId',function(req, res, next){
    var params = req.body.params;
    mobileService.findJRYYCustomerCollectionByUserId({params:params})
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
})

//查询到店未出单员工列表
router.post('/findDDWCDWorkCollection',function(req, res, next){
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    var roleId = user.role.roleId;
    var params = {storeId:storeId,roleId:roleId};
    console.log(storeId);
    mobileService.findDDWCDWorkCollection(params)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
})

/**
 * 查询将脱保(或已脱保)员工列表
 * param: storeId,
 *        cusLostInsurStatu 潜客脱保状态
 */
router.post('/findTBWorkCollection',function(req, res, next){
    var params = req.body.params;
    mobileService.findTBWorkCollection({params:params})
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
})

/**
 * 查询到店未出单对应员工的潜客列表
 * param: userId,currentPage
 */
router.post('/findDDWCDCustomer',function(req, res, next){
    var params = req.body.params;
    mobileService.findDDWCDCustomer({params:params})
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
})

/**
 * 查询将脱保(或已脱保)对应员工的潜客列表
 * param: userId 用户id
 *        cusLostInsurStatu 潜客脱保状态
 *        currentPage 当前页数
 */
router.post('/findTBCustomer',function(req, res, next){
    var user = JSON.parse(req.cookies.bip_user);
    var roleId = user.role.roleId;
    var params = req.body.params;
    mobileService.findTBCustomer({params:params,roleId:roleId})
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
})

/**
 * 根据店ID查询用户
 */
router.post('/findUsersByStoreId',function(req, res, next){
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    var roleId = user.role.roleId;

    var params = {storeId:storeId,roleId:roleId};
    mobileService.findUsersByStoreId(params)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
})

/**
 * 今日创建保单
 * param: storeId 4s店id
 *        currentPage 当前页数
 */
router.post('/findBillTodayCreate',function(req, res, next){
    var user = JSON.parse(req.cookies.bip_user);
    var params = req.body.params;
    var userId = user.userId;

    mobileService.findBillTodayCreate({params:params,userId:userId})
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
})

/**
 * 查询已激活对应员工的潜客列表
 * param: userId,currentPage
 */
router.post('/findByJiHuo',function(req, res, next){
    var params = req.body.params;
    mobileService.findByJiHuo({params:params})
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
})

/**
 * 查询已激活对应员工的潜客列表
 * param: currentPage...
 */
router.post('/findReturnDSPCustomer',function(req, res, next){
    var user = JSON.parse(req.cookies.bip_user);
    var params = req.body.params;
    var userId = user.userId;
    var roleId = user.role.roleId;
    var storeId = user.store.storeId;
    var returnStatus = '3,7';
    mobileService.findReturnDSPCustomer({params:params,returnStatus:returnStatus,userId:userId,roleId:roleId,storeId:storeId})
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
})

/**
 * 可删除邀约
 * param: userId,currentPage
 */
router.post('/selectKSCYY',function(req, res, next){
    var customerId = req.body.customerId;
    var currentPage = req.body.currentPage;
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    mobileService.selectKSCYY({customerId:customerId,userId:userId,currentPage:currentPage})
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
})

//APP潜客查询
router.post('/findCustomerByConditionApp',function(req, res, next){
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var roleId = user.role.roleId;
    var storeId = user.store.storeId;
    var params = req.body.params;

    mobileService.findCustomerByConditionApp({params:params,userId:userId,roleId:roleId,storeId:storeId})
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

/**
 * 可删除邀约详情
 * param: userId,currentPage
 */
router.post('/selectKSCYYXQ',function(req, res, next){
    var customerTraceId = req.body.customerTraceId;
    mobileService.selectKSCYYXQ({customerTraceId:customerTraceId})
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
})

/*
* 跟踪完成查询
* params: userId, returnStatu, currentPage
*/
router.post('/findGZFinishedCustomer',function(req, res, next){
    var params = req.body.params;

    mobileService.findGZFinishedCustomer({params:params})
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//查询跟踪完成员工列表
router.post('/findGZWCWorkCollection',function(req, res, next){
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    var roleId = user.role.roleId;
    var params = {storeId:storeId,roleId:roleId};
    mobileService.findGZWCWorkCollection(params)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
})

//查询已回退员工列表
router.post('/findYHTWorkCollection',function(req, res, next){
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    var roleId = user.role.roleId;
    var params = {storeId:storeId,roleId:roleId};
    mobileService.findYHTWorkCollection(params)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
})

//查询战败线索员工列表
router.post('/findZBXSWorkCollection',function(req, res, next){
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    var bangStatu = user.store.bangStatu;
    var bspStoreId = user.store.bspStoreId;
    var csModuleFlag = user.store.csModuleFlag;
    var params = {storeId:storeId,csModuleFlag:csModuleFlag,bangStatu:bangStatu,bspStoreId:bspStoreId};
    mobileService.findZBXSWorkCollection(params)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
})

//按用户id查询线索列表信息
router.post('/findDefeatedSourceByUserId',function(req, res, next){
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    var bangStatu = user.store.bangStatu;
    var bspStoreId = user.store.bspStoreId;
    var userId = req.body.userId;
    var currentPage = req.body.currentPage;
    var params = {storeId:storeId,userId:userId,currentPage:currentPage,bangStatu:bangStatu,bspStoreId:bspStoreId};
    mobileService.findDefeatedSourceByUserId(params)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
})

module.exports = router;
