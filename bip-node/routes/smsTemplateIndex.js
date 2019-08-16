var express = require('express');
var router = express.Router();
var smsTemplateService = require("../service/smsTemplateService");

/**
 * 查询营销模板
 */
router.post('/findByCondition', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;

    var param = {storeId:storeId};
    smsTemplateService.findByCondition(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

/**
 * 新增营销模板
 * param: smsTemplate bean
 */
router.post('/saveSmsTemplate', function(req, res, next) {
    var condition = req.body.condition;

    var param = {condition:condition};
    smsTemplateService.saveSmsTemplate(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

/**
 * 修改营销模板
 */
router.post('/updateTemplateById', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    var condition = req.body.condition;

    var param = {condition:condition,storeId:storeId};
    smsTemplateService.updateTemplateById(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

/**
 * 删除营销模板
 */
router.post('/deleteTemplateById', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userName = user.userName;
    var id = req.body.id;

    var param = {id:id,userName:userName};
    smsTemplateService.deleteTemplateById(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

/**
 * 根据模板id查询营销模板
 */
router.post('/findTemplateById', function(req, res, next) {
    var id = req.body.id;

    var param = {id:id};
    smsTemplateService.findTemplateById(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

/**
 * 禁用/启用营销模板
 */
router.post('/updateEnabledState', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userName = user.userName;
    var storeId = user.store.storeId;
    var id = req.body.id;
    var enabledState = req.body.enabledState;

    var param = {id:id,storeId:storeId,userName:userName,enabledState:enabledState};
    smsTemplateService.updateEnabledState(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

/**
 * 营销短信链接查询模板详情
 * @param obj
 */
router.post('/showModule', function(req, res, next) {
    var customerId = req.body.customerId;

    var param = {customerId:customerId};
    smsTemplateService.showModule(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});



module.exports = router;
