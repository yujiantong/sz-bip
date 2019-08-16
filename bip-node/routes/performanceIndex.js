/**
 * Created by qiumingyu on 2016/6/29.
 */
var express = require('express');
var router = express.Router();
var performanceService = require("../service/performanceService");
var web =  require("../common/configure").webConfigure;


//统计新保
router.post('/statisticalNewInsurance', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var roleId = user.role.roleId;
    var storeId = user.store.storeId;
    var coverType = req.body.coverType;
    var statisticTime = req.body.statisticTime;

    var param = {userId:userId, storeId:storeId, coverType:coverType, statisticTime:statisticTime,roleId:roleId}
    performanceService.statisticalNewInsurance(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })

});


//统计新转续，间转续，潜转续，续转续
router.post('/statisticalByRenewalType', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var roleId = user.role.roleId;
    var storeId = user.store.storeId;
    var renewalType = req.body.renewalType;
    var statisticTime = req.body.statisticTime;

    var param = {userId:userId,storeId:storeId, statisticTime:statisticTime,renewalType:renewalType,roleId:roleId}
    performanceService.statisticalByRenewalType(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })

});
module.exports = router;