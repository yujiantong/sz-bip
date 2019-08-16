var express = require('express');
var router = express.Router();
var blocService = require("../service/blocService");

//新增集团
router.post('/addBloc', function(req, res, next) {
    var data = req.body.data;
    var param = {data:data};

    blocService.addBloc(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//修改集团
router.post('/updateBloc', function(req, res, next) {
    var data = req.body.data;
    var param = {data:data};

    blocService.updateBloc(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//按条件查询集团
router.post('/findByCondition', function(req, res, next) {
    var data = req.body.data;
    var param = {data:data};

    blocService.findByCondition(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//删除集团
router.post('/deleteBloc', function(req, res, next) {
    var data = req.body.data;
    var param = {data:data};

    blocService.deleteBloc(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//按条件校验集团的信息是否存在
router.post('/findExistByCondition', function(req, res, next) {
    var data = req.body.data;
    var param = {data:data};

    blocService.findExistByCondition(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

module.exports = router;