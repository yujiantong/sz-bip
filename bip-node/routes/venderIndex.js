/**
 * Created by huliangqing on 2017/07/28.
 */
var express = require('express');
var router = express.Router();
var venderService = require("../service/venderService");

//新增赠品
router.post('/insert', function(req, res, next) {
    var condition = req.body.condition;
    var param = {condition:condition};

    venderService.insert(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//修改厂家
router.post('/update', function(req, res, next) {
    var condition = req.body.condition;
    var param = {condition:condition};

    venderService.update(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//按条件查询厂家
router.post('/findVenderByCondition', function(req, res, next) {
    var condition = req.body.condition;
    var param = {condition:condition};

    venderService.findVenderByCondition(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

module.exports = router;