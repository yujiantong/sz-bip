/**
 * Created by hlq on 2017/03/13.
 */
var express = require('express');
var router = express.Router();
var updatePasswordRecordService = require("../service/updatePasswordRecordService");

/*
 * 查询更新密码记录
 * param: storeId,operateTime
 */
router.post('/findByStoreAndTime', function(req, res, next) {
    var params = req.body.params;

    var param = {params: params};
    updatePasswordRecordService.findByStoreAndTime(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

/*
 * 新增更新密码记录
 * param: property of UpdatePasswordRecord bean
 */
router.post('/addUpdateRecord', function(req, res, next) {
    var params = req.body.params;

    var param = {params: params};
    updatePasswordRecordService.addUpdateRecord(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

/**
 * 查询最近的更新密码操作记录
 * param: storeId
 */
router.post('/findLatestRecordByStore', function(req, res, next) {
    var params = req.body.params;

    var param = {params: params};
    updatePasswordRecordService.findLatestRecordByStore(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});
module.exports = router;
