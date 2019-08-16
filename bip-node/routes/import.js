var express = require('express');
var router = express.Router();
var importService = require("../service/importService");
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

function setConnectionTimeout(req, res, next) {
    req.socket.setTimeout(2 * 60 * 60 * 1000);
    next();
}

router.post('/importData',setConnectionTimeout, multipartMiddleware, function(req, res, next) {
    var source = req.files.file.path;
    var filename = req.files.file.name;
    var fourSStoreId = JSON.parse(req.cookies.bip_user).store.storeId;
    var fourSStore = JSON.parse(req.cookies.bip_user).store.storeName;
    var importCategory = req.body.importCategory;
    var isFugai = req.body.isFugai;
    var userId = JSON.parse(req.cookies.bip_user).userId;
    console.log(source);
    console.log(filename);
    importService.importData(source,fourSStoreId,fourSStore,importCategory,isFugai,userId)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        });
});

router.post('/sleepBatch',setConnectionTimeout, multipartMiddleware, function(req, res, next) {
    var source = req.files.file.path;
    var filename = req.files.file.name;
    var fourSStoreId = JSON.parse(req.cookies.bip_user).store.storeId;
    var userId = JSON.parse(req.cookies.bip_user).userId;
    console.log(source);
    console.log(filename);
    importService.sleepBatch(source,fourSStoreId,userId)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        });
});

//销售战败潜客导入
router.post('/importDefeat',setConnectionTimeout, multipartMiddleware, function(req, res, next) {
    var source = req.files.file.path;
    var filename = req.files.file.name;
    var fourSStoreId = JSON.parse(req.cookies.bip_user).store.storeId;
    console.log(source);
    console.log(filename);
    importService.importDefeat(source,fourSStoreId)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        });
});

router.post('/tsxImport',setConnectionTimeout, multipartMiddleware, function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var source = req.files.file.path;
    var filename = req.files.file.name;
    var storeId = user.store.storeId;
    var storeName = user.store.storeName;
    var importCategory = req.body.importCategory;
    var insuranceCompName = req.body.insuranceCompName;
    var userId = user.userId;
    console.log(source);
    console.log(filename);
    importService.tsxImport(source,storeId,importCategory,insuranceCompName)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        });
});


module.exports = router;
