/**
 * Created by qiumingyu on 2016/10/10.
 */
var express = require('express');
var router = express.Router();
var sysnService = require("../service/sysnService");
var web =  require("../common/configure").webConfigure;
var utilBsp = require('../common/utilBsp');


//查询bsp同步过来的所有店
router.post('/findBspStore', function(req, res, next) {
        sysnService.findBspStore()
            .then(function(result){
                res.json(result);
            })
            .catch(function(err){
                res.json(err);
            })
});


//将bsp的店绑定带bip的店中
router.post('/sysnBspStore',function(req,res,next){
    var bspStoreName = req.body.bspStoreName;
    var bspStoreId = req.body.bspStoreId;
    var storeId = req.body.storeId;
    var param = {bspStoreName:bspStoreName,bspStoreId:bspStoreId,storeId:storeId};
    sysnService.sysnBspStore(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err)
        })
})

//删除bip店中绑定的bsp店
router.post('/delBangedBspStore',function(req,res,next){
    var storeId = req.body.storeId;
    var param = {storeId:storeId};
    sysnService.delBangedBspStore(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err)
        })
})

//检查该店是否已经绑定过
router.post('/checkStoreIsBang',function(req,res,next){
    var storeId = req.body.storeId;
    var param = {storeId:storeId};
    sysnService.checkStoreIsBang(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err)
        })
})

//绑定用户
router.post('/sysnBspUser',function(req,res,next){
    var bangParam = req.body.bangParam;
    var param = {bangParam:bangParam};
    sysnService.sysnBspUser(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err)
        })
})


//解除绑定的用户
router.post('/delBangedBspUser',function(req,res,next){
    var delBangParam = req.body.delBangParam;
    var param = {delBangParam:delBangParam};
    sysnService.delBangedBspUser(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err)
        })
})

//根据bip的店id查询所有的未绑定的用户
router.post('/findNoBangedUser',function(req,res,next){
    var storeId = req.body.storeId;
    var param = {storeId:storeId};
    sysnService.findNoBangedUser(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err)
        })
})


//根据bip的店id查询所有的用户（前提是bip的店已经和bsp店绑定好了）
router.post('/findBipBspUser',function(req,res,next){
    var storeId = req.body.storeId;
    var param = {storeId:storeId};
    sysnService.findBipBspUser(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err)
        })
})

//查询工作量的接口
router.get('/findBipWork',function(req,res,next){
    /*var bspEncryptLoginInfo = "011987213AA84FA94F63AD211C442959E560A16F0A82FF4FAB91364FC6F14" +
        "108638EE6E8E319A68DEBA3A1203C7AACE19CF967202BC2D1E58F24F0DD61EBB956";*/
    var bspEncryptLoginInfo = req.query.bspEncryptLoginInfo||"";
    if(bspEncryptLoginInfo==""){
        res.json(utilBsp.getRs(false,"链接无效",null));
        return;
    }
    var param = {bspEncryptLoginInfo:bspEncryptLoginInfo};
    sysnService.findBipWork(param)
        .then(function(result){
            res.json(utilBsp.getRs(result.results.success,result.results.message,result.results.content));
        })
        .catch(function(err){
            res.json(err)
        })
})
module.exports = router;