/**
 * Created by huliangqing on 2016/10/31.
 */
var express = require('express');
var router = express.Router();
var suggestService = require("../service/suggestService");

//新增建议
router.post('/addSuggest', function(req, res, next) {
    var suggestInfo = req.body.suggestInfo;
    suggestService.addSuggest(suggestInfo)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});
//查询建议
router.post('/selectAllSuggest', function(req, res, next) {
    var searchDatas = req.body.searchDatas;
    var start = req.body.start;
    var user = JSON.parse(req.cookies.bip_user);
    var roleId = user.role.roleId;
    suggestService.selectAllSuggest(searchDatas,start,roleId)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});
//解决建议
router.post('/solveSuggest', function(req, res, next) {
    var param = req.body.param;
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var userName = user.userName;
    suggestService.solveSuggest(param,userId,userName)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});
//按照建议人ID查询建议
router.post('/findAllSuggestByUserId', function(req, res, next) {
    var condition = req.body.condition;
    var param = {condition:condition};
    suggestService.findAllSuggestByUserId(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

module.exports = router;
