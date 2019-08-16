var express = require('express');
var router = express.Router();
var mobileService = require("../service/reasonService");

/**
 * 新增回退失销原因
 * param: reason bean
 */
router.post('/addReason',function(req, res, next){
    var params = req.body.params;
    mobileService.addReason({params:params})
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
                res.json(err);
        })
})

/**
 * 删除回退失销原因
 * param: id
 */
router.post('/deleteById',function(req, res, next){
    var params = req.body.params;
    mobileService.deleteById({params:params})
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
})


/**
 * 修改原因
 * params: reason bean
 */
router.post('/updateReason',function(req, res, next){
    var params = req.body.params;
    mobileService.updateReason({params:params})
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
})


/**
 * 查询原因列表
 * params: storeId
 */
router.post('/findAllReason',function(req, res, next){
    var params = req.body.params;

    mobileService.findAllReason({params:params})
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
})

/**
 * 查询回退失销原因的下拉框
 * params: storeId
 */
router.post('/findForSelectData',function(req, res, next){
    var params = req.body.params;
    mobileService.findForSelectData({params:params})
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
})


module.exports = router;
