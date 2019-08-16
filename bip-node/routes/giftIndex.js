/**
 * Created by huliangqing on 2017/07/28.
 */
var express = require('express');
var router = express.Router();
var giftService = require("../service/giftService");

//新增赠品
router.post('/addGift', function(req, res, next) {
    var giftInfo = req.body.giftInfo;

    giftService.addGift(giftInfo)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//根据赠品类型等条件查询赠品
router.post('/findGiftByCondition', function(req, res, next) {
    var condition = req.body.condition;
    var param = {condition:condition};

    giftService.findGiftByCondition(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//根据赠品编码查询赠品
router.post('/findGiftByCode', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    var giftCode = req.body.giftCode;

    var param = {storeId:storeId,giftCode:giftCode}
    giftService.findGiftByCode(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//修改赠品
router.post('/updateGiftByCode', function(req, res, next) {
    var giftInfo = req.body.giftInfo;

    giftService.updateGiftByCode(giftInfo)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//根据赠品编码或者名称自动联想查询赠品
router.post('/findGiftByCodeOrName', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    var searchCondition = req.body.searchCondition;
    var giftType = req.body.giftType;

    var param = {storeId:storeId,searchCondition:searchCondition,giftType:giftType}
    giftService.findGiftByCodeOrName(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//操作赠品生效或者不生效
router.post('/updateGiftStaus', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    var giftCode = req.body.giftCode;
    var status = req.body.status;

    var param = {storeId:storeId,giftCode:giftCode,status:status}
    giftService.updateGiftStaus(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//根据条件查询赠送信息相关联的保单信息
router.post('/findGivingByCondition', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    var roleId = user.role.roleId;
    var condition = req.body.condition;

    var param = {condition:condition,storeId:storeId,roleId:roleId};
    console.log("findGivingByCondition=param=>" + param)
    giftService.findGivingByCondition(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//根据审批单ID查询赠送信息
router.post('/findGivingByApprovalBillId', function(req, res, next) {
    var approvalBillId = req.body.approvalBillId;
    var param = {approvalBillId:approvalBillId};
    giftService.findGivingByApprovalBillId(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});
// exportGiftRecord 导出赠品信息
router.post('/exportGiftRecord', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    var roleId = user.role.roleId;
    var condition = req.body.condition;

    var param = {condition:condition,storeId:storeId,roleId:roleId};
    giftService.givingExportGiftRecord(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//修改赠送信息
router.post('/updateGiving', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    var userId = user.userId;
    var userName = user.userName;
    var condition = req.body.condition;

    var param = {condition:condition,storeId:storeId,userId:userId,userName:userName};
    giftService.updateGiving(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//打印核销单
router.post('/printHxd', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    var approvalBillId = req.body.approvalBillId;
    var param = {storeId:storeId,approvalBillId:approvalBillId,billFlag:1};
    giftService.printHxd(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});


//根据审批单ID查询核销记录
router.post('/findAllHxRecordByApprovalBillId', function(req, res, next) {
    var condition = req.body.condition;
    
    var param = {condition:condition};
    giftService.findAllHxRecordByApprovalBillId(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

module.exports = router;
