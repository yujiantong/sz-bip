/**
 * Created by qiumingyu on 2016/6/3.
 */
var express = require('express');
var router = express.Router();
var customerService = require("../service/customerService");
var web =  require("../common/configure").webConfigure;



//根据跟踪状态查询
router.post('/findByTraceStatu', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var roleId = user.role.roleId;
    var storeId = user.store.storeId;
    var condition = req.body.condition;
    var param = {userId:userId,storeId:storeId,roleId:roleId,condition:condition}

    if( userId != 0){
        customerService.findByTraceStatu(param)
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

//根据跟踪状态查询潜客跟踪记录
router.post('/findByTraceStatuGzjl', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var roleId = user.role.roleId;
    var storeId = user.store.storeId;
    var condition = req.body.condition;
    var param = {userId:userId,storeId:storeId,roleId:roleId,condition:condition}
    if( userId != 0){
        customerService.findByTraceStatuGzjl(param)
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

//根据潜客脱保状态查询
router.post('/findByCusLostInsurStatu', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var roleId = user.role.roleId;
    var storeId = user.store.storeId;
    var condition = req.body.condition;
    var param = {userId:userId,storeId:storeId,roleId:roleId,condition:condition}
    if( userId != 0 ){
        customerService.findByCusLostInsurStatu(param)
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

//根据潜客脱保状态查询跟踪记录
router.post('/findByCusLostInsurStatuGzjl', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var roleId = user.role.roleId;
    var storeId = user.store.storeId;
    var condition = req.body.condition;
    var param = {userId:userId,storeId:storeId,roleId:roleId,condition:condition}
    if( userId != 0 ){
        customerService.findByCusLostInsurStatuGzjl(param)
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

//根据接收状态查询
router.post('/findByAcceptStatu', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var roleId = user.role.roleId;
    var storeId = user.store.storeId;
    var condition = req.body.condition;
    var param = {userId:userId,storeId:storeId,roleId:roleId,condition:condition}
    if(userId != 0  ){
        customerService.findByAcceptStatu(param)
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

//根据接收状态查询跟踪记录
router.post('/findByAcceptStatuGzjl', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var roleId = user.role.roleId;
    var storeId = user.store.storeId;
    var condition = req.body.condition;
    var param = {userId:userId,storeId:storeId,roleId:roleId,condition:condition}
    if( userId != 0  ){
        customerService.findByAcceptStatuGzjl(param)
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

//根据回退状态查询
router.post('/findByReturnStatu', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var storeId = user.store.storeId;
    var roleId = user.role.roleId;
    var condition = req.body.condition;
    var param = {userId:userId,storeId:storeId,roleId:roleId,condition:condition}
    if( userId != 0  ){
        customerService.findByReturnStatu(param )
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

//根据回退状态查询跟踪记录
router.post('/findByReturnStatuGzjl', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var storeId = user.store.storeId;
    var roleId = user.role.roleId;
    var condition = req.body.condition;
    var param = {userId:userId,storeId:storeId,roleId:roleId,condition:condition}
    if( userId != 0  ){
        customerService.findByReturnStatuGzjl(param )
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

//根据待回退和待延期查询查询（待审批 = 待回退 + 待延期）
router.post('/findByApproval', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var roleId = user.role.roleId;
    var storeId = user.store.storeId;
    var condition = req.body.condition;
    var param = {userId:userId,storeId:storeId,roleId:roleId,condition:condition}
    if(  userId != 0  ){
        customerService.findByApproval(param)
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

//根据待回退和待延期查询查询跟踪记录（待审批 = 待回退 + 待延期）
router.post('/findByApprovalGzjl', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var roleId = user.role.roleId;
    var storeId = user.store.storeId;
    var condition = req.body.condition;
    var param = {userId:userId,storeId:storeId,roleId:roleId,condition:condition}
    if(  userId != 0  ){
        customerService.findByApprovalGzjl(param)
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
//根据邀约状态查询
router.post('/findByInviteStatu', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var roleId = user.role.roleId;
    var storeId = user.store.storeId;
    var condition = req.body.condition;
    var param = {userId:userId,storeId:storeId,roleId:roleId,condition:condition}
    if(userId != 0  ){
        customerService.findByInviteStatu(param)
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

//根据邀约状态查询跟踪记录
router.post('/findByInviteStatuGzjl', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var roleId = user.role.roleId;
    var inviteStatu = req.body.inviteStatu;
    var storeId = user.store.storeId;
    var condition = req.body.condition;
    var param = {userId:userId,storeId:storeId,roleId:roleId,condition:condition}
    if(userId != 0  ){
        customerService.findByInviteStatuGzjl(param)
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

//根据查询字段条件查询
router.post('/findByCondition', function(req, res, next) {
    var searchDatas = JSON.parse(req.body.searchDatas);
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var roleId = user.role.roleId;
    var storeId = user.store.storeId;
    searchDatas.userId = user.userId;
    if(searchDatas.userId != 0  ){
        customerService.findByCondition(JSON.stringify(searchDatas),userId,roleId,storeId)
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

//根据多条件查询潜客跟踪记录
router.post('/findCustByConditionGzjl', function(req, res, next) {
    var param = req.body.searchDatas;
    customerService.findCustByConditionGzjl(param)
        .then(function(result){
            console.log("************************************result"+result);
            res.json(result);
        })
        .catch(function(err){
            console.log("************************************err"+err);
            res.json(err);
        })
});

//续保专员跟踪回退
router.post('/traceReturn', function(req, res, next) {
  /*  var userId = req.query.userId;
    var customerId = req.query.customerId;*/
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
     var customerId = req.body.customerId;
    var superiorId = user.superiorId;
    var userName = user.userName;
    var returnReason = req.body.htyy;
    var storeId = user.store.storeId;//商店id
    var principalId = req.body.principalId;
    var principal = req.body.principal;
    var htyyxz = req.body.htyyxz;
    var applyStatu = req.body.applyStatu;
    if(customerId != 0 &&　userId != 0  ){
        customerService.traceReturn(customerId, userId, superiorId,userName,returnReason,storeId,principalId,principal,htyyxz,applyStatu)
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


//续保专员跟踪删除邀约
router.post('/deleteInvite', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var userName = user.userName;
    var deleteInvietReason = req.body.scyyyy;
    var customerId = req.body.customerId;
    var customerTraceId = req.body.customerTraceId;
    var principalId = req.body.principalId;
    var principal = req.body.principal;
    if(customerTraceId != 0 &&　userId != 0  ){
        customerService.deleteInvite(customerTraceId, userId, deleteInvietReason, userName,customerId,principalId,principal)
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


//根据查潜客Id查询潜客信息和跟踪信息
router.get('/findByCustomerId', function(req, res, next) {
    var customerId = req.query.customerId;
    var user = JSON.parse(req.cookies.bip_user);
    var roleId = user.role.roleId;
    customerService.findByCustomerId(customerId,roleId)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })

});

//新增潜客
router.post('/addCustomer', function(req, res, next) {
    var customerInfo = req.body.customerInfo;
    var generateCustomerFlag = req.body.generateCustomerFlag;
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    var userId = user.userId;
    var userName = user.userName;
    var roleId = user.role.roleId;
    customerService.addCustomer(customerInfo,storeId,userId,userName,roleId,generateCustomerFlag)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});
//根据潜客的级别自动带出下次跟踪日期
router.post('/setNextTraceDay',function(req, res, next){
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var storeId = user.store.storeId;
    var customerLevel = req.body.customerLevel;
    var customerId = req.body.customerId;
    var param = {userId : userId, customerLevel : customerLevel, storeId : storeId, customerId:customerId};
    customerService.setNextTraceDay(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

//添加跟踪信息
router.post('/addTraceRecord', function(req, res, next) {

    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var storeId = user.store.storeId;
    var roleId = user.role.roleId;
    var userName = user.userName;
    var customerTraceRecode = req.body.customerTraceRecode;
    var traceFlag = req.body.traceFlag;
    var returnReason = req.body.htyy;
    var htyyxz = req.body.htyyxz;
    var applyStatu = req.body.applyStatu;

    var param = {customerTraceRecode:customerTraceRecode,userId:userId,storeId:storeId,
        traceFlag:traceFlag,roleId:roleId,userName:userName,returnReason:returnReason,htyyxz:htyyxz,applyStatu:applyStatu};
    customerService.addTraceRecord(param).then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })

});

//更新接受状态
router.post('/updateAcceptStatu', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var userName = user.userName;
    var customerId = req.body.customerId;
    var principalId = req.body.principalId||-1;
    var principal = req.body.principal||'';
    customerService.updateAcceptStatu(customerId,userId,userName,principalId,principal)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })

});


//销售,服务等顾问的接受处理
//router.get('/updateConsultantAcceptStatu', function(req, res, next) {
//    var user = JSON.parse(req.cookies.bip_user);
//    var userId = user.userId;
//    var userName = user.userName;
//    var customerId = req.query.customerId;
//    customerService.updateConsultantAcceptStatu(customerId,userId,userName)
//        .then(function(result){
//            res.json(result);
//        })
//        .catch(function(err){
//            res.json(err);
//        })
//
//});

//客服专员的接受处理
//router.get('/updateCseAcceptStatu', function(req, res, next) {
//    var user = JSON.parse(req.cookies.bip_user);
//    var userId = user.userId;
//    var userName = user.userName;
//    var customerId = req.query.customerId;
//    customerService.updateCseAcceptStatu(customerId,userId,userName)
//        .then(function(result){
//            res.json(result);
//        })
//        .catch(function(err){
//            res.json(err);
//        })
//
//});

//更换接收人时,更新当前分配人的信息
router.post('/changePrincipal', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var prePrincipalId = req.body.principalId;//更换前的负责人id
    var prePrincipal = req.body.principal;//更换前的负责人名字
    var superiorId = user.userId;//更换前的负责人上级的id
    var principalId = req.body.newPrincipalId;//更换后的负责人id
    var principal = req.body.newPrincipal;//更换后的负责人名字
    var customerId = req.body.customerId;//潜客id
    var userId = user.userId;//用户id
    var userName = user.userName;//用户名称
    var returnReason = req.body.ghfzryy;//原因
    var storeId = user.store.storeId;//商店id
    var param = {customerId: customerId, principalId: principalId, principal: principal,prePrincipalId:prePrincipalId,prePrincipal:prePrincipal,
        superiorId:superiorId,userId:userId,userName:userName,returnReason:returnReason,storeId:storeId
    };
    customerService.changePrincipal(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//指定接收人时,更新当前分配人的信息
router.post('/assignPrincipal', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var prePrincipalId = req.body.principalId;//更换前的负责人id
    var superiorId = user.userId;//更换前的负责人上级的id
    var principalId = req.body.newPrincipalId;//更换后的负责人id
    var principal = req.body.principal;//更换后的负责人名字
    var customerId = req.body.customerId;//潜客id
    var userId = user.userId;//用户id
    var userName = user.userName;//用户名称
    var returnReason = req.body.ghfzryy;//原因
    var storeId = user.store.storeId;//商店id
    var param = {customerId: customerId, principalId: principalId, principal: principal,prePrincipalId:prePrincipalId,
        superiorId:superiorId,userId:userId,userName:userName,returnReason:returnReason,storeId:storeId
    };
    customerService.assignPrincipal(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//销售,服务等经理更换接收人
router.post('/managerChangePrincipal', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var prePrincipalId = req.body.principalId;//更换前的负责人id
    var prePrincipal = req.body.principal;//更换前的负责人名字
    var superiorId = user.userId;//更换前的负责人上级的id
    var principalId = req.body.clerkId;//更换后的负责人id
    var principal = req.body.clerk;//更换后的负责人名字
    var customerId = req.body.customerId;//潜客id
    var returnReason = req.body.ghfzryy;//原因
    var userId = user.userId;//用户id
    var userName = user.userName;//用户名称
    var storeId = user.store.storeId;//商店id
    var param = {customerId: customerId, principalId: principalId, principal: principal,prePrincipalId:prePrincipalId,prePrincipal:prePrincipal,
        superiorId:superiorId,userId:userId,userName:userName,returnReason:returnReason,storeId:storeId};
    customerService.managerChangePrincipal(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//续保主管跟踪回退处理
router.post('/traceReturnXbzg', function(req, res, next) {
  /*  var userId = req.query.userId;
    var customerId = req.query.customerId;
    var principalId = req.query.principalId;*/
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var customerId = req.body.customerId;
    var principalId = req.body.principalId;
    var principal = req.body.principal;
    var userName = user.userName;
    var storeId = user.store.storeId;
    var returnReason = req.body.tyhtyj;
    console.log("principalId = "+principalId);
    customerService.traceReturnXbzg(customerId,userId,storeId,principalId,principal,userName,returnReason)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })

});

//跟踪完成操作
router.post('/traceFinishHandle', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var userName = user.userName;
    var customerId = req.body.customerId;
    var storeId = user.store.storeId;
    var principalId = req.body.principalId||-1;
    var principal = req.body.principal||'';
    var roleId = user.role.roleId;

    var param = {customerId:customerId, userId:userId,storeId:storeId,userName:userName,principalId:principalId,
        principal:principal,roleId:roleId}
    customerService.traceFinishHandle(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })

});


//销售顾问回退
router.post('/returnBySC', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var customerId = req.body.customerId;
    var superiorId = user.superiorId;
    var returnReason = req.body.htyy;
    var userName = user.userName;
    var storeId = user.store.storeId;
    var principalId = req.body.principalId;
    var principal = req.body.principal;
    if(userId != 0 && customerId != 0 && superiorId != 0){
        customerService.returnBySC(customerId,userId,userName,superiorId,returnReason,storeId,principalId,principal)
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

//销售经理回退
router.post('/returnBySCM', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var customerId = req.body.customerId;
    var clerkId = req.body.clerkId;
    var principalId = req.body.principalId;
    var principal = req.body.principal;
    var returnReason = req.body.tyhtyj;
    var userName = user.userName;
    var storeId = user.store.storeId;
    if(userId != 0 && customerId != 0 && clerkId != 0){
        customerService.returnBySCM(customerId,userId,userName,clerkId,returnReason,storeId,principalId,principal)
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


//服务顾问回退
router.post('/returnByFwgw', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var customerId = req.body.customerId;
    var superiorId = user.superiorId;
    var returnReason = req.body.htyy;
    var userName = user.userName;
    var storeId = user.store.storeId;
    var principalId = req.body.principalId;
    var principal = req.body.principal;
    if(userId != 0 && customerId != 0 && superiorId != 0){
        customerService.returnByFwgw(customerId,userId,userName,superiorId,returnReason,storeId,principalId,principal)
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

//服务经理回退
router.post('/returnByFwgwM', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var customerId = req.body.customerId;
    var clerkId = req.body.clerkId;
    var returnReason = req.body.tyhtyj;
    var userName = user.userName;
    var storeId = user.store.storeId;
    var principalId = req.body.principalId;
    var principal = req.body.principal;
    if(userId != 0 && customerId != 0 && clerkId != 0){
        customerService.returnByFwgwM(customerId,userId,userName,clerkId,returnReason,storeId,principalId,principal)
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

//客服专员失销
router.post('/lostSale', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var storeId = user.store.storeId;
    var customerId = req.body.customerId;
    var principalId = req.body.principalId;
    var principal = req.body.principal;
    var superiorId = user.superiorId;
    var lostReason = req.body.sxyy;
    var userName = user.userName;
    var sxyyxz = req.body.sxyyxz;
    if(userId != 0 && customerId != 0 && superiorId != 0){
        customerService.lostSale(customerId,storeId,userId,superiorId,lostReason,userName,principalId,principal,sxyyxz)
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
//激活
router.post('/wakeUpCustomer', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var customerId = req.body.customerId;
    var principalId = req.body.principalId;
    var principal = req.body.principal;
    var wakeReason = req.body.hxyy;
    var userName = user.userName;
    var storeId = user.store.storeId;
    var loginRoleId = user.role.roleId;
    if(userId != 0 && customerId != 0){
        customerService.wakeUpCustomer(customerId,userId,principalId,principal,wakeReason,userName,storeId,loginRoleId)
        //customerService.wakeUpCustomer(1,3,2)
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

//延期申请操作,更新回退状态为待延期状态
router.post('/updateReturnStatuToDyq', function(req, res, next) {
    var customerId = req.body.customerId;
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var superiorId = user.superiorId;//用户上级id
    var returnReason = req.body.yqyy;
    var userName = user.userName;
    var storeId = user.store.storeId;
    var principalId = req.body.principalId;
    var principal = req.body.principal;
    var applyDelayDay = req.body.applyDelayDay;
    var param = {customerId:customerId, userId:userId,userName:userName,
        superiorId:superiorId,returnReason:returnReason,storeId:storeId,principalId:principalId,principal:principal,applyDelayDay:applyDelayDay}
    customerService.updateReturnStatuToDyq(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })

});


//延期审批时,更新回退状态为已延期状态,更新延期到期日为当前时间加 7天
router.post('/updateReturnStatuToYyq', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;//当前审批操作者id
    var customerId = req.body.customerId;
    var principalId = req.body.principalId;
    var principal = req.body.principal;
    var returnReason = req.body.tyyqyj;
    var userName = user.userName;
    var storeId = user.store.storeId;
    var param = {customerId:customerId, userId:userId,userName:userName,
        principalId:principalId,principal:principal,returnReason:returnReason,storeId:storeId}
    customerService.updateReturnStatuToYyq(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })

});

//续保主管直接点击延期
router.post('/updateReturnStatuByRD', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;//当前审批操作者id
    var customerId = req.body.customerId;
    var principalId = req.body.principalId;
    var principal = req.body.principal;
    var returnReason = req.body.yqyy;
    var userName = user.userName;
    var storeId = user.store.storeId;
    var param = {customerId:customerId, userId:userId,userName:userName,
        principalId:principalId,principal:principal,returnReason:returnReason,storeId:storeId}
    customerService.updateReturnStatuByRD(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })

});

//续保专员更新接受状态(批量)
router.post('/updateAcceptStatuBatch', function(req, res, next) {
    var customerInfo = req.body.customerInfo;
    var user = JSON.parse(req.cookies.bip_user);
    var userName = user.userName;
    customerService.updateAcceptStatuBatch(customerInfo,userName)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })

});

//客服专员更新接受状态(批量)
router.post('/updateCseAcceptStatuBatch', function(req, res, next) {
    var customerInfo = req.body.customerInfo;
    var user = JSON.parse(req.cookies.bip_user);
    var userName = user.userName;
    customerService.updateCseAcceptStatuBatch(customerInfo,userName)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })

});

//续保主管不同意回退
router.post('/unAgreeTraceReturnXbzg', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var customerId = req.body.customerId;
    var userId = user.userId;
    var principalId = req.body.principalId;
    var principal = req.body.principal;
    var returnReason = req.body.jjhtyy;
    var userName = user.userName;
    var storeId = user.store.storeId;
    var param = {customerId:customerId, userId:userId,userName:userName,principalId:principalId,principal:principal,
        returnReason:returnReason,storeId:storeId}
    customerService.unAgreeTraceReturnXbzg(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })

});
//延期审批拒绝时,更新回退状态为: 1
router.post('/updateReturnStatuToCszt', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var customerId = req.body.customerId;
    var principalId = req.body.principalId;//当前负责人id
    var principal = req.body.principal;//当前负责人名字
    var userId = JSON.parse(req.cookies.bip_user).userId;//当前审批操作者id
    var returnReason = req.body.jjyqyy;
    var userName = user.userName;
    var storeId = user.store.storeId;
    var param = {customerId:customerId, userId:userId,userName:userName,
        principalId:principalId,principal:principal,returnReason:returnReason,storeId:storeId}
    customerService.updateReturnStatuToCszt(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

//销售经理不同意回退
router.post('/unAgreeReturnBySCM', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var customerId = req.body.customerId;
    var userId = user.userId;
    var clerkId = req.body.clerkId;
    var principalId = req.body.principalId;
    var principal = req.body.principal;
    var returnReason = req.body.jjhtyy;
    var userName = user.userName;
    var storeId = user.store.storeId;
    var param = {customerId:customerId, userId:userId,userName:userName,clerkId:clerkId,
        principalId:principalId,principal:principal,
        returnReason:returnReason,storeId:storeId}
    customerService.unAgreeReturnBySCM(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});
//服务经理不同意回退
router.post('/unAgreeReturnByFwgwM', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var customerId = req.body.customerId;
    var userId = user.userId;
    var clerkId = req.body.clerkId;
    var principalId = req.body.principalId;
    var principal = req.body.principal;
    var returnReason = req.body.jjhtyy;
    var userName = user.userName;
    var storeId = user.store.storeId;
    var param = {customerId:customerId, userId:userId,userName:userName,
        clerkId:clerkId,principalId:principalId,principal:principal,returnReason:returnReason,storeId:storeId}
    customerService.unAgreeReturnByFwgwM(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })

});

//销售,服务等顾问的接受处理(批量)
router.post('/updateConsultantAcceptStatuBatch', function(req, res, next) {
    var customerInfo = req.body.customerInfo;
    var user = JSON.parse(req.cookies.bip_user);
    var userName = user.userName;
    customerService.updateConsultantAcceptStatuBatch(customerInfo,userName)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })

});

//更新潜客信息
router.post('/updateCustomerInfo', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var userName = user.userName;
    var superiorId = user.superiorId||-1;
    var storeId = user.store.storeId;
    var customer = req.body.customer;
    var principalId = req.body.principalId||-1;
    var principal = req.body.principal||'';
    var roleId = user.role.roleId;
    var holderId = req.body.holderId||-1;

    customerService.updateCustomerInfo({customer:customer,userId:userId,userName:userName,
            storeId:storeId,superiorId:superiorId,principalId:principalId,principal:principal,roleId:roleId,holderId:holderId})
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

//新增报价记录
router.post('/addCustomerBJRecode', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var userName = user.userName;
    var stroeId = user.store.storeId;
    var customerBJRecode = req.body.customerBJRecode;
    customerService.addCustomerBJRecode(customerBJRecode,userId,userName,stroeId)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});
//按潜客ID查询该潜客所有的报价信息
router.post('/findListCustomerBJRecode', function(req, res, next) {
    var customerId = req.body.customerId;
    customerService.findListCustomerBJRecode(customerId)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});
//查询潜客审批单记录
router.post('/findApprovalBillRecordList', function(req, res, next) {
    var chassisNumber = req.body.chassisNumber;
    var user = JSON.parse(req.cookies.bip_user);
    var fourSStoreId = user.store.storeId;
    customerService.findApprovalBillRecordList(chassisNumber,fourSStoreId)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

//客服专员唤醒潜客
router.post('/activateCustomer', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var customerId = req.body.customerId;
    var principalId = req.body.principalId;
    var principal = req.body.principal;
    var activateReason = req.body.jhyy;
    var userName = user.userName;
    var storeId = user.store.storeId;
    var param = {userId:userId,customerId:customerId,principalId:principalId,principal:principal,activateReason:activateReason,userName:userName,storeId:storeId}
    customerService.activateCustomer(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});
//客服专员睡眠潜客
router.post('/customerSleep', function(req, res, next) {
    var customerId = req.body.customerId;
    var principalId = req.body.principalId;
    var principal = req.body.principal;
    var sleepReason = req.body.smyy;
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var userName = user.userName;
    var param = {customerId:customerId,principalId:principalId,principal:principal,sleepReason:sleepReason,
        userId:userId,userName:userName};
    customerService.customerSleep(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

//续保主管睡眠潜客
router.post('/customerSleepByRD', function(req, res, next) {
    var customerId = req.body.customerId;
    var principalId = req.body.principalId;
    var principal = req.body.principal;
    var sleepReason = req.body.smyy;
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var userName = user.userName;
    var param = {customerId:customerId,principalId:principalId,principal:principal,sleepReason:sleepReason,
        userId:userId,userName:userName};
    customerService.customerSleepByRD(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

//查询已经唤醒的潜客
router.post('/findActivateCustomer', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var storeId = user.store.storeId;
    var roleId = user.role.roleId;
    var condition = req.body.condition;

    var param = {userId:userId,storeId:storeId,roleId:roleId,condition:condition}
    if(userId != 0  ){
        customerService.findActivateCustomer( param )
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

//查询已经唤醒的潜客跟踪记录
router.post('/findActivateCustomerGzjl', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var storeId = user.store.storeId;
    var roleId = user.role.roleId;
    var condition = req.body.condition;

    var param = {userId:userId,storeId:storeId,roleId:roleId,condition:condition}
    if(userId != 0  ){
        customerService.findActivateCustomerGzjl( param )
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

//查询bsp战败从而转到bip的潜客
router.post('/findDefeatCustomer', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var bspStoreId = user.store.bspStoreId;
    var bipStoreId = user.store.storeId;
    var userId = user.userId;
    var roleId = user.role.roleId;
    var startTime = req.body.startTime;
    var endTime = req.body.endTime;
    var startNum = req.body.startNum;
    var showAll = req.body.showAll;
    var sxyy = req.body.sxyy;
    var bangStatu = user.store.bangStatu;
    var shortZbqk=req.body.short;
    var shortmain=req.body.shortmain;
    var param = {bspStoreId:bspStoreId,startTime:startTime,endTime:endTime,startNum:startNum,showAll:showAll,
        sxyy:sxyy,bangStatu:bangStatu,bipStoreId:bipStoreId,userId:userId,roleId:roleId,shortZbqk:shortZbqk,shortmain:shortmain};
    customerService.findDefeatCustomer(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        });
});

//战败潜客
router.post('/saveDefeatCustomer', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    var contactWay = req.body.contactWay;

    var param = {storeId:storeId,contactWay:contactWay};
    customerService.saveDefeatCustomer(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        });
});

//主动回退
router.post('/activeReturn',function(req, res, next){
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var customerId = req.body.customerId;
    var principalId = req.body.principalId;
    var principal = req.body.principal;
    var userName = user.userName;
    var storeId = user.store.storeId;
    var activeReturnReason = req.body.zdhtyy;
    var param = {customerId:customerId,userId:userId,principalId:principalId,principal:principal,userName:userName,activeReturnReason:activeReturnReason,storeId:storeId}
    if(customerId != 0 &&　userId != 0  ){

        customerService.activeReturn(param)
            .then(function(result){
                res.json(result);
            })
            .catch(function(err){
                res.json(err);
            })
    }else{
        res.json({status:web.fault,"message":"无效的参数ss"});
    }
})

//手动请求壁虎刷新潜客信息，修改潜客
router.post('/manual', function(req, res, next) {
    var condition = req.body.condition;
    var param = {condition:condition};
    customerService.manual(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        });
});

//手动请求壁虎刷新潜客信息，新增潜客
router.post('/newCover', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    var userId = user.userId;
    var carLicenseNumber = req.body.carLicenseNumber;
    var chassisNumber = req.body.chassisNumber;
    var engineNumber = req.body.engineNumber;
    var certificateNumber = req.body.certificateNumber;
    var flag = req.body.flag;
    var param = {userId:userId,storeId:storeId,carLicenseNumber:carLicenseNumber,chassisNumber:chassisNumber,
        engineNumber:engineNumber,flag:flag,certificateNumber:certificateNumber}
    customerService.newCover(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        });
});

//邀约查询
router.post('/findInviteStatuRC', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var roleId = user.role.roleId;
    var storeId = user.store.storeId;
    var condition = req.body.condition;
    var param = {userId:userId,storeId:storeId,roleId:roleId,condition:condition}

    customerService.findInviteStatuRC(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        });
});

//邀约查询
router.post('/findInviteStatuRD', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    //var userId = user.userId;
    var roleId = user.role.roleId;
    var storeId = user.store.storeId;
    var condition = req.body.condition;
    var param = {userId:null,storeId:storeId,roleId:roleId,condition:condition};
    console.log(roleId+"-----------------------------------------");
    customerService.findInviteStatuRD(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        });
});

//续保主管批量换人
router.post('/changePrincipalBatchRD', function(req, res, next) {
    var changePrincipalFlag = 1;
    var data = req.body.data;
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    var userId = user.userId;
    var userName = user.userName;

    var param = {data:data,storeId:storeId,userId:userId,userName:userName,changePrincipalFlag:changePrincipalFlag};
    customerService.changePrincipalBatchRD(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })

});

//服务经理或者销售经理批量换人
router.post('/changePrincipalBatchSM', function(req, res, next) {
    var changePrincipalFlag = 0;
    var data = req.body.data;
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    var userId = user.userId;
    var userName = user.userName;

    var param = {data:data,storeId:storeId,userId:userId,userName:userName,changePrincipalFlag:changePrincipalFlag};
    customerService.changePrincipalBatchSM(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })

});

//根据建档人id查询潜客
router.post('/findCustomerByCreater', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var roleId = user.role.roleId;
    var storeId = user.store.storeId;
    var renewalType = req.body.renewalType;
    var chassisNumber = req.body.chassisNumber;
    var carLicenseNumber = req.body.carLicenseNumber;
    var contact = req.body.contact;
    var contactWay = req.body.contactWay;
    var startNum = req.body.startNum;
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var defeatFlag = req.body.defeatFlag;
    var shortJdr = req.body.short;
    var shortmain = req.body.shortmain;

    var param = {shortJdr:shortJdr,shortmain:shortmain,startNum:startNum,userId:userId,storeId:storeId,roleId:roleId,renewalType:renewalType,chassisNumber:chassisNumber,
        carLicenseNumber:carLicenseNumber,contact:contact,contactWay:contactWay,startDate:startDate,endDate:endDate,defeatFlag:defeatFlag}
    customerService.findCustomerByCreater(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

//验证车架号是否重复
router.post('/yzChaNum', function(req, res, next) {
    var condition = req.body.condition;
    var param = {condition:condition};
    customerService.yzChaNum(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});


router.post('/getMessage', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    var customerId = req.body.customerId;
    var param = {"storeId":storeId,"customerId":customerId};
    customerService.getMessage(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});
//获取用户的壁虎保险信息
router.post('/findBxInfoForBH', function(req, res, next) {
    var customerId = req.body.customerId;
    var param = {"customerId":customerId};
    customerService.findBxInfoForBH(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//已激活查询潜客
router.post('/findByJiHuo', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var roleId = user.role.roleId;
    var storeId = user.store.storeId;
    var condition = req.body.condition;
    var param = {userId:userId,storeId:storeId,roleId:roleId,condition:condition}
    customerService.findByJiHuo(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//查询到店未出单潜客
router.post('/findDdwcdCus', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var roleId = user.role.roleId;
    var storeId = user.store.storeId;
    var condition = req.body.condition;
    var param = {userId:userId,storeId:storeId,roleId:roleId,condition:condition}
    customerService.findDdwcdCus(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//前台主管按不同状态查询潜客
router.post('/findByStatusQtzg', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    var condition = req.body.condition;
    var param = {storeId:storeId,condition:condition};

    customerService.findByStatusQtzg(param )
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        });
});

//前台主管的潜客查询
router.post('/findByConditionQtzg', function(req, res, next) {
    var searchDatas = JSON.parse(req.body.searchDatas);
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;

    customerService.findByConditionQtzg(JSON.stringify(searchDatas),storeId)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        });
});

//前台主管的潜客查询
router.post('/ceshi', function(req, res, next) {
    var parm = req.body.parm;

    customerService.ceshi(parm)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        });
});

//销售经理/服务经理主动回退
router.post('/returnByXSJLZD', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var customerId = req.body.customerId;
    var clerkId = req.body.clerkId;
    var principalId = req.body.principalId;
    var principal = req.body.principal;
    var returnReason = req.body.tyhtyj;
    var userName = user.userName;
    var storeId = user.store.storeId;
    if(userId != 0 && customerId != 0 && clerkId != 0){
        customerService.returnByXSJLZD(customerId,userId,userName,clerkId,returnReason,storeId,principalId,principal)
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

//查询已回退潜客记录数
router.post('/findByYiHuiTui', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var roleId = user.role.roleId;
    var storeId = user.store.storeId;
    var condition = req.body.condition;
    var param = {userId:userId,storeId:storeId,roleId:roleId,condition:condition}
    customerService.findByYiHuiTui(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//取消睡眠
router.post('/saveCancelSleep', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var fourSStoreId = user.store.storeId;
    var userName = user.userName;
    var customerId = req.body.customerId;
    var principalId = req.body.principalId;
    var principal = req.body.principal;
    var jqxrqEnd = req.body.jqxrqEnd;

    var param = {userId:userId,userName:userName,customerId:customerId,principalId:principalId,principal:principal,
        fourSStoreId:fourSStoreId,jqxrqEnd:jqxrqEnd}

    customerService.saveCancelSleep(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});
//根据customerId和dcbjrq查询报价信息
router.post('/findBJListByCustomerId', function(req, res, next) {
    var condition = req.body.condition;
    var param = {condition:condition}
    customerService.findBJListByCustomerId(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//根据customerId查询潜客跟踪次数
router.post('/findGzCount', function(req, res, next) {
    var customerId = req.body.customerId;
    var param = {customerId:customerId}
    customerService.findGzCount(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

router.post('/getMessageByUC', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    var jqxrqEnd = req.body.jqxrqEnd;
    var param = {"storeId":storeId,"jqxrqEnd":jqxrqEnd};
    customerService.getMessageByUC(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});
//批量睡眠
router.post('/sleepBatchXBZG', function(req, res, next) {
    var fourSStoreId = JSON.parse(req.cookies.bip_user).store.storeId;
    var userId = JSON.parse(req.cookies.bip_user).userId;
    var condition = req.body.condition;

    var param = {fourSStoreId: fourSStoreId,userId: userId,condition:condition};
    customerService.sleepBatchXBZG(param)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        });
});
//批量失销
router.post('/batchLostSale', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var userName = user.userName;
    var storeId = user.store.storeId;
    var superiorId = user.superiorId;
    var condition = req.body.condition;
    var param = {userId:userId,userName:userName,storeId:storeId,superiorId:superiorId,condition:condition};
    customerService.batchLostSale(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

//根据线索id查询线索
router.post('/findDefeatedSourceById', function(req, res, next) {
    var id = req.body.id;

    var param = {id:id};
    customerService.findDefeatedSourceById(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

//续保主管失销
router.post('/lostByXbzg', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var userName = user.userName;
    var storeId = user.store.storeId;
    var customerId = req.body.customerId;
    var principalId = req.body.principalId;
    var principal = req.body.principal;
    var sxyy = req.body.sxyy;
    var sxyyxz = req.body.sxyyxz;

    var params = {
        userId:userId,userName:userName,storeId:storeId,customerId:customerId,principalId:principalId,
        principal:principal,sxyy:sxyy,sxyyxz:sxyyxz
    };
    customerService.lostByXbzg(params)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        });
});

//续保专员撤销回退，失销，睡眠
router.post('/cancelReturn', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var userName = user.userName;
    var storeId = user.store.storeId;
    var condition = req.body.condition;
    var params = {userId:userId,userName:userName,storeId:storeId,condition:condition};
    customerService.cancelReturn(params)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

module.exports = router;
