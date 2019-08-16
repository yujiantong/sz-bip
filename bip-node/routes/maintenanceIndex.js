/**
 * Created by chenrunlin on 2017/06/21.
 */
var express = require('express');
var router = express.Router();
var maintenanceService = require("../service/maintenanceService");

/**
 * 根据条件查询维修记录
 */
router.post('/findByCondition', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var roleId = user.role.roleId;
    var storeId = user.store.storeId;
    var condition = req.body.condition;
    var param = {userId:userId,roleId:roleId,storeId:storeId,condition:condition}
    maintenanceService.findByCondition(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

/**
 * 根据施工单号和店ID查询维修项目以及维修配件
 */
router.post('/findByMaintainNumber', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    var maintainNumber = req.body.maintainNumber;
    var param = {storeId:storeId,maintainNumber:maintainNumber}
    maintenanceService.findByMaintainNumber(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

/**
 * 新增推送修记录
 */
router.post('/addPushMaintenance', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    var condition = req.body.condition;
    var param = {storeId:storeId,condition:condition}
    maintenanceService.addPushMaintenance(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

/**
 * 根据条件查询推送修记录
 */
router.post('/findByConditionTSX', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    var condition = req.body.condition;
    var param = {storeId:storeId,condition:condition}
    maintenanceService.findByConditionTSX(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

/**
 * 根据条件查询推送修记录
 */
router.post('/findPMaintenanceByRNumber', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    var reportNumber = req.body.reportNumber;
    var param = {storeId:storeId,reportNumber:reportNumber}
    maintenanceService.findPMaintenanceByRNumber(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

/**
 * 台帐的推送修查询
 */
router.post('/findTzPushMaintenance', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    var condition = req.body.condition;
    var param = {storeId:storeId,condition:condition}
    maintenanceService.findTzPushMaintenance(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

module.exports = router;
