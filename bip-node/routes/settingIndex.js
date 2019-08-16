/**
 * Created by qiumingyu on 2016/6/4.
 */
var express = require('express');
var router = express.Router();
var settingService = require("../service/settingService");
var web =  require("../common/configure").webConfigure;


// ------------------- 续保主管参数设置开始---------------------
// 查询出已存在的保险公司
router.get('/initInsuranceComp', function(req, res, next) {
    var fourSId = JSON.parse(req.cookies.bip_user).store.storeId;
    console.log("aa");
    if(fourSId != 0 ){
        settingService.initInsuranceComp(fourSId)
            .then(function(result){
                res.json(result);
            })
            .catch(function(err){
                res.json(err);
            })
    }else{
        res.json({status:web.fault,"message":"无效的参数ss"});
    }
});

//将以选中的保险公司保存到数据库
router.post('/updateInsuranceComp', function(req, res, next) {
  /*  var insuranceCompIds = req.body.insuranceCompIds*/
    var insuranceCompIds = req.body.insuranceCompIds;
    var fourSId = req.body.fourSId;
    if(insuranceCompIds != null && fourSId != 0 ){
        settingService.updateInsuranceComp( insuranceCompIds, fourSId )
            .then(function(result){
                res.json(result);
            })
            .catch(function(err){
                res.json(err);
            })
    }else{
        res.json({status:web.fault,"message":"无效的参数ss"});
    }

});


//查询该4s店的所有保险公司
router.get('/findByFourSId', function(req, res, next) {
    /*  var insuranceCompIds = req.body.insuranceCompIds*/
    var fourSId = JSON.parse(req.cookies.bip_user).store.storeId;
    if( fourSId != 0 ){
        settingService.findByFourSId(fourSId )
            .then(function(result){
                res.json(result);
            })
            .catch(function(err){
                res.json(err);
            })
    }else{
        res.json({status:web.fault,"message":"无效的参数ss"});
    }

});

//查询模块开启设置
router.post('/findModuleSet', function(req, res, next) {
    var storeId = JSON.parse(req.cookies.bip_user).store.storeId;
        settingService.findModuleSet(storeId)
            .then(function(result){
                res.json(result);
            })
            .catch(function(err){
                res.json(err);
            })
});

//查询级别跟踪设置
router.post('/findTraceDaySet', function(req, res, next) {
    var storeId = JSON.parse(req.cookies.bip_user).store.storeId;
    settingService.findTraceDaySet(storeId)
        .then(function(result){
                res.json(result);
            })
            .catch(function(err){
                res.json(err);
            })
});

//更新模块开启设置
router.post('/updateModuleSet', function(req, res, next) {
    var moduleSetInfo = req.body.moduleSetInfo;
    if(moduleSetInfo != null && moduleSetInfo != null ){
        settingService.updateModuleSet(moduleSetInfo)
            .then(function(result){
                res.json(result);
            })
            .catch(function(err){
                res.json(err);
            })
    }else{
        res.json({status:web.fault,"message":"无效的参数ss"});
    }
});

//更新级别跟踪天数设置
router.post('/updateTraceDaySet', function(req, res, next) {
    var traceDaySetInfo = req.body.traceDaySetInfo;
    if(traceDaySetInfo != null && traceDaySetInfo != null ){
        settingService.updateTraceDaySet(traceDaySetInfo)
            .then(function(result){
                res.json(result);
            })
            .catch(function(err){
                res.json(err);
            })
    }else{
        res.json({status:web.fault,"message":"无效的参数ss"});
    }
});

//查询手续费设置
router.post('/findFactorage', function(req, res, next) {
    var compPreId = req.body.compPreId;
    var storeId = JSON.parse(req.cookies.bip_user).store.storeId;
    settingService.findFactorage(compPreId,storeId)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

//更新手续费设置
router.post('/updateFactorage', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var userName = user.userName;
    var factorageInfo = req.body.factorageInfo;
    if(factorageInfo != null && factorageInfo != null ){
        settingService.updateFactorage(factorageInfo,userId,userName)
            .then(function(result){
                res.json(result);
            })
            .catch(function(err){
                res.json(err);
            })
    }else{
        res.json({status:web.fault,"message":"无效的参数ss"});
    }
});

//保存手续费设置
router.post('/insertFactorage', function(req, res, next) {
    var factorageInfo = req.body.factorageInfo;
    if(factorageInfo != null && factorageInfo != null ){
        settingService.insertFactorage(factorageInfo)
            .then(function(result){
                res.json(result);
            })
            .catch(function(err){
                res.json(err);
            })
    }else{
        res.json({status:web.fault,"message":"无效的参数ss"});
    }
});

//保存级别跟踪天数设置
router.post('/insertTraceDaySet', function(req, res, next) {
    var traceDaySetInfo = req.body.traceDaySetInfo;
    if(traceDaySetInfo != null && traceDaySetInfo != null ){
        settingService.insertTraceDaySet(traceDaySetInfo)
            .then(function(result){
                res.json(result);
            })
            .catch(function(err){
                res.json(err);
            })
    }else{
        res.json({status:web.fault,"message":"无效的参数ss"});
    }
});

//保存模块开启设置
router.post('/insertModuleSet', function(req, res, next) {
    var moduleSetInfo = req.body.moduleSetInfo;
    if(moduleSetInfo != null && moduleSetInfo != null ){
        settingService.insertModuleSet(moduleSetInfo)
            .then(function(result){
                res.json(result);
            })
            .catch(function(err){
                res.json(err);
            })
    }else{
        res.json({status:web.fault,"message":"无效的参数ss"});
    }
});

//根据4s店id查询保险公司信息
router.post('/findCompInfoByStoreId', function(req, res, next) {
    var storeId = JSON.parse(req.cookies.bip_user).store.storeId;
    settingService.findCompInfoByStoreId(storeId)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

//总经理设置锁死客户级别
router.post('/updateStoreLockLevel', function(req, res, next) {
    var storeId = JSON.parse(req.cookies.bip_user).store.storeId;
    var lockLevel = req.body.lockLevel;

    var param = {storeId:storeId,lockLevel:lockLevel};
    settingService.updateStoreLockLevel(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

module.exports = router;