var express = require('express');
var router = express.Router();
var commonService = require("../service/commonService");

router.get('/findAllCoverType', function(req, res, next) {
    commonService.findAllCoverType()
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

//根据用户查询数量(应跟踪/未接收/待审批/将脱保/已脱保)
router.post('/findCountByUserId', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var storeId = user.store.storeId;
    var roleId = user.role.roleId;
    var bspStoreId = user.store.bspStoreId;
    var bangStatu = user.store.bangStatu;
    commonService.findCountByUserId(userId,storeId,roleId,bspStoreId,bangStatu)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

//根据用户id查询未读消息
router.post('/findMessageByUserId', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var roleId = user.role.roleId;
    commonService.findMessage(userId,roleId)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

//查询系统消息
router.post('/findSysMessage', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    commonService.findSysMessage(userId)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

//插入系统消息
router.post('/insertSysMessage', function(req, res, next) {
    var content = req.body.content;
    commonService.insertSysMessage(content)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

//删除系统消息
router.post('/deleteSysMessage', function(req, res, next) {
    var sysMessageId = req.body.sysMessageId;
    commonService.deleteSysMessage(sysMessageId)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

//根据店id查询店信息
router.post('/findStoreById', function(req, res, next) {
    var storeId = req.body.storeId;
    commonService.findStoreById(storeId)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

//APP首页查询各业务的数量(今日到店/今日出单/回退待审批/延期待审批/未接收/应跟踪/发起邀约/到店未出单/将脱保/已脱保)
router.post('/findHomePageCount', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var roleId = user.role.roleId;
    var storeId = user.store.storeId;

    var param = {userId:userId, storeId:storeId,roleId:roleId};
    commonService.findHomePageCount(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

module.exports = router;
