
var express = require('express');
var router = express.Router();
var biHuService = require("../service/biHuService");
var web =  require("../common/configure").webConfigure;
var utilBsp = require('../common/utilBsp');

function setConnectionTimeout(req, res, next) {
    req.socket.setTimeout(5 * 60 * 1000);
    next();
}

//申请报价
router.post('/applyBJ',setConnectionTimeout,function(req,res,next){
    /*var condition = {
        storeId: 49,
        userId: 225,
        customerId: 139172,
        source:[1,2],
        bjInfo: {
            LicenseNo: '京QG13J7',
            ForceTax: 2
        }
    }
    var param = {condition:JSON.stringify(condition)};*/
    var condition = req.body.condition;
    var param = {condition:condition};
    biHuService.applyBJ(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

//保存报价
router.post('/saveBJ',function(req,res,next){
    var condition = req.body.condition;
    var param = {condition:condition};
    biHuService.saveBJ(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

/**
 * 用bofide提供的接口报价
 */
router.post('/applyBJFromBofide',function(req,res,next){
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    var condition = req.body.condition;
    var param = {condition:condition,storeId:storeId};
    biHuService.applyBJFromBofide(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

/**
 * 调用博福接口获取车辆已投保信息
 */
router.post('/getCarInsuranceInfo',function(req,res,next){
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    var condition = req.body.condition;

    var param = {condition:condition,storeId:storeId};
    biHuService.getCarInsuranceInfo(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

router.post('/getModels',function(req,res,next){
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    var userId = user.userId;
    var condition = req.body.condition;
    var param = {condition:condition,storeId:storeId,userId:userId};
    biHuService.getModels(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

module.exports = router;