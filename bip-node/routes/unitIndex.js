/**
 * Created by huliangqing on 2017/07/28.
 */
var express = require('express');
var router = express.Router();
var unitService = require("../service/unitService");

//新增事业部门
router.post('/insert', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var jtId = user.jtId;
    var unitName = req.body.unitName;
    var param = {jtId:jtId,unitName:unitName};

    unitService.insert(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//按条件查询事业部门
router.post('/findUnitByCondition', function(req, res, next) {
    var condition = req.body.condition;
    var param = {condition:condition};

    unitService.findUnitByCondition(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//修改事业部门和店之间的关联
router.post('/updateUnitAndStore', function(req, res, next) {
    var condition = req.body.condition;
    var param = {condition:condition};

    unitService.updateUnitAndStore(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//根据不同条件查询4s店
router.post('/findStore', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var jtId = user.jtId;
    var unitId = req.body.unitId;
    var param = {jtId:jtId,unitId:unitId};

    unitService.findStore(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

module.exports = router;