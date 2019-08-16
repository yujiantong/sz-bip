var express = require('express');
var router = express.Router();
var statisticService = require("../service/statisticService");

//保险信息统计查询
router.post('/findInsuranceStatistics', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var showAll = req.body.showAll;
    var storeId = user.store.storeId;

    var param = {startDate:startDate, endDate:endDate, storeId:storeId, showAll:showAll}
    statisticService.findInsuranceStatistics(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })

});

//售后信息统计查询
router.post('/findServiceStatistics', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var showAll = req.body.showAll;
    var storeId = user.store.storeId;

    var param = {startDate:startDate, endDate:endDate, storeId:storeId, showAll:showAll}
    statisticService.findServiceStatistics(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })

});

//销售信息统计查询
router.post('/findSaleStatistics', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var showAll = req.body.showAll;
    var storeId = user.store.storeId;

    var param = {startDate:startDate, endDate:endDate, storeId:storeId, showAll:showAll}
    statisticService.findSaleStatistics(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })

});

//续保专员的保险信息统计查询
router.post('/findRCInsuranceStatistics', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var showAll = req.body.showAll;
    var storeId = user.store.storeId;
    var userId = user.userId;

    var param = {startDate:startDate, endDate:endDate, storeId:storeId, userId:userId,showAll:showAll}
    statisticService.findRCInsuranceStatistics(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })

});

//服务顾问的售后信息统计查询
router.post('/findSAServiceStatistics', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var showAll = req.body.showAll;
    var storeId = user.store.storeId;
    var userId = user.userId;

    var param = {startDate:startDate, endDate:endDate, storeId:storeId, userId:userId,showAll:showAll}
    statisticService.findSAServiceStatistics(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })

});

//销售顾问的销售信息统计查询
router.post('/findSCSaleStatistics', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var showAll = req.body.showAll;
    var storeId = user.store.storeId;
    var userId = user.userId;

    var param = {startDate:startDate, endDate:endDate, storeId:storeId, userId:userId,showAll:showAll}
    statisticService.findSCSaleStatistics(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })

});

//客服信息统计查询
router.post('/findCSCStatistics', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var showAll = req.body.showAll;
    var param = {startDate:startDate, endDate:endDate, storeId:storeId, showAll:showAll}
    statisticService.findCSCStatistics(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })

});

//客服专员的信息统计查询
router.post('/findCSCUserStatistics', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var showAll = req.body.showAll;
    var param = {startDate:startDate, endDate:endDate, userId:userId, showAll:showAll}
    statisticService.findCSCUserStatistics(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })

});

//出单员信息统计查询
router.post('/findIWStatistics', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var showAll = req.body.showAll;
    var param = {startDate:startDate, endDate:endDate, storeId:storeId, showAll:showAll}
    statisticService.findIWStatistics(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })

});

module.exports = router;
