var express = require('express');
var router = express.Router();
var sendMessageService = require("../service/sendMessageService");

router.post('/sendMessage', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    var phone = req.body.phone;
    var userId = user.userId;
    var userName = user.userName;
    var customerId = req.body.customerId;
    var content = req.body.content;
    var contact = req.body.contact;
    var principalId = req.body.principalId;
    var principal = req.body.principal;
    var nicheng = req.body.nicheng;
    var sendWay = req.body.sendWay;

    sendMessageService.sendMessage(storeId,userId,userName,customerId,contact,phone,content,
        principalId,principal,nicheng,sendWay)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

/**
 * 查询发送过的短信
 * param: storeId,currentPage
 */
router.post('/findPhoneMessage',function(req, res, next){
    var params = req.body.params;
    sendMessageService.findPhoneMessage({params:params})
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
})

module.exports = router;
