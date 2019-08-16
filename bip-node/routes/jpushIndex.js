/**
 * Created by huliangqing on 2018/03/01.
 */
var express = require('express');
var router = express.Router();
var jpushService = require("../service/jpushService");

//新增极光推送用户信息
router.post('/addJpush', function(req, res, next) {
    var params = req.body.params;

    var param = {params:params};
    jpushService.addJpush(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

module.exports = router;