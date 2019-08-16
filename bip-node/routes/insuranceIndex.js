/**
 * Created by qiumingyu on 2016/6/3.
 */
var express = require('express');
var router = express.Router();
var insuranceService = require("../service/insuranceService");
var web =  require("../common/configure").webConfigure;


//查询保单明细,id是保单id
router.get('/findDetail', function(req, res, next) {
   var id = req.query.insuranceBillId;
    if(id ){
        insuranceService.findDetail( id )
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

//查询保单对应的跟踪记录
router.get('/findRecord', function(req, res, next) {
    /* var id = req.body.id;*/
    var id = req.query.insuranceBillId;
    if(id ){
        insuranceService.findRecord( id )
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

//查询保单对应的跟踪记录
router.post('/findRecord', function(req, res, next) {
    var id = req.body.id;
    if(id ){
        insuranceService.findRecord( id )
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

//新增保单
router.post('/addInsurance', function(req, res, next) {
    var insureInfo = req.body.insureInfo;
    var traceRecord = req.body.traceRecord;
    var identifying = req.body.identifying;
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var userName = user.userName;
    var storeId = user.store.storeId;
    var approvalBillAll = req.body.approvalBillAll;
    var insuTypes = req.body.insuTypes;
    if(identifying == 0){
        var body = {insureInfo:insureInfo,traceRecord:traceRecord,storeId:storeId,userId:userId,
            userName:userName,approvalBillAll:approvalBillAll,insuTypes:insuTypes}
        insuranceService.addInsurance(body)
            .then(function(result){
                res.json(result);
            })
            .catch(function(err){
                res.json(err);
            });
    }else if(identifying == 1){
        var body = {insureInfo:insureInfo,insuTypes:insuTypes}
        insuranceService.saveOldInsurance(body)
            .then(function(result){
                res.json(result);
            })
            .catch(function(err){
                res.json(err);
            });
    }

});

//按车架号查询信息
router.post('/findTraceRecord', function(req, res, next) {
    var chassisNumber = req.body.chassisNumber;
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    if(chassisNumber ){
        insuranceService.findTraceRecord(chassisNumber,storeId )
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

//根据承保类型和出单日期查询
router.post('/findByCovertypeAndCdrq', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    var coverType = req.body.coverType;
    var startTime = req.body.startTime;
    var endTime = req.body.endTime;
    var startNum =  req.body.startNum; //开始页
    var showAll = req.body.showAll;
    var shortBd= req.body.short;
    var shortmainBd =req.body.shortmain;
    var obj = {storeId:storeId,coverType: coverType, startTime: startTime, endTime: endTime,startNum:startNum,showAll:showAll,shortBd:shortBd,shortmainBd:shortmainBd};
    insuranceService.findByCovertypeAndCdrq(obj)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//续保专员按投保类型查询保单
router.post('/findRCInsuranceBill', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var principalId = user.userId;
    var coverType = req.body.coverType;
    var startTime = req.body.startTime;
    var endTime = req.body.endTime;
    var startNum =  req.body.startNum; //开始页
    var showAll = req.body.showAll;
    var shortBd= req.body.short;
    var shortmainBd =req.body.shortmain;
    var obj = {principalId:principalId, coverType: coverType, startTime: startTime, endTime: endTime,startNum:startNum,showAll:showAll,shortBd:shortBd,shortmainBd:shortmainBd};
    insuranceService.findRCInsuranceBill(obj)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//销售或者服务顾问按投保类型查询保单
router.post('/findSCOrSAInsuranceBill', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var clerkId = user.userId;
    var coverType = req.body.coverType;
    var startTime = req.body.startTime;
    var endTime = req.body.endTime;
    var startNum =  req.body.startNum; //开始页
    var showAll = req.body.showAll;
    var shortBd= req.body.short;
    var shortmainBd =req.body.shortmain;
    var obj = {shortBd:shortBd,shortmainBd:shortmainBd,clerkId: clerkId, coverType: coverType, startTime: startTime, endTime: endTime,startNum:startNum,showAll:showAll};
    insuranceService.findSCOrSAInsuranceBill(obj)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
 });
//销售经理按投保类型查询保单
router.post('/findSaMInsuranceBill', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    var roleId = 6;//这个角色id不是指登录用户的角色id
    var coverType = req.body.coverType;
    var startTime = req.body.startTime;
    var endTime = req.body.endTime;
    var startNum =  req.body.startNum; //开始页
    var showAll = req.body.showAll;
    var shortBd= req.body.short;
    var shortmainBd =req.body.shortmain;
    var obj = {shortBd:shortBd,shortmainBd:shortmainBd,storeId:storeId,roleId: roleId, coverType: coverType, startTime: startTime, endTime: endTime,startNum:startNum,showAll:showAll};
    insuranceService.findSaMInsuranceBill(obj)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//服务经理按投保类型查询保单
router.post('/findSeMInsuranceBill', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    var roleId = 8;//这个角色id不是指登录用户的角色id
    var coverType = req.body.coverType;
    var startTime = req.body.startTime;
    var endTime = req.body.endTime;
    var startNum =  req.body.startNum; //开始页
    var showAll = req.body.showAll;
    var shortBd= req.body.short;
    var shortmainBd =req.body.shortmain;
    var obj = {storeId:storeId,roleId: roleId, coverType: coverType, startTime: startTime, endTime: endTime,startNum:startNum,showAll:showAll,
        shortBd:shortBd,shortmainBd:shortmainBd};
    insuranceService.findSeMInsuranceBill(obj)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//根据不同情况查询保单,保单的多功能查询
router.post('/findByMoreCondition', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    var condition = req.body.condition;
    var startNum = req.body.startNum;
    var obj = {storeId:storeId,condition:condition,startNum:startNum};
    insuranceService.findByMoreCondition(obj)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//续保专员根据不同情况查询保单
router.post('/findAllRCInsuranceBill', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var principalId = user.userId;
    var condition = req.body.condition;
    var startNum = req.body.startNum;
    var obj = {principalId:principalId,condition: condition,startNum:startNum};
    insuranceService.findAllRCInsuranceBill(obj)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//服务或者销售顾问根据不同情况查询保单
router.post('/findAllSCOrSAInsuranceBill', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var clerkId = user.userId;
    var condition = req.body.condition;
    var startNum = req.body.startNum;
    var shortBd = req.body.short;
    var shortmainBd = req.body.shortmain;
    var obj = {clerkId:clerkId,condition: condition,startNum:startNum};
    insuranceService.findAllSCOrSAInsuranceBill(obj,shortBd,shortmainBd)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//服务经理根据不同情况查询保单
router.post('/findAllSeMInsuranceBill', function(req, res, next) {
    var roleId = 8;//这个角色id不是指登录用户的角色id
    var condition = req.body.condition;
    var startNum = req.body.startNum;
    var obj = {roleId:roleId,condition: condition,startNum:startNum};
    insuranceService.findAllSeMInsuranceBill(obj)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//销售经理根据不同情况查询保单
router.post('/findAllSaMInsuranceBill', function(req, res, next) {
    var roleId = 6;//这个角色id不是指登录用户的角色id
    var condition = req.body.condition;
    var startNum = req.body.startNum;
    var obj = {roleId:roleId,condition: condition,startNum:startNum};
    insuranceService.findAllSaMInsuranceBill(obj)
        .then(function (result) {
            res.json(result);
        })
        .catch(function (err) {
            res.json(err);
        })
});

//确认邀约到店
router.post('/confirmIntoStore', function(req, res, next) {
    var customerId = req.body.customerId;
    var principalId = req.body.principalId;
    var principal = req.body.principal;
    var holderId = req.body.holderId;
    var user = JSON.parse(req.cookies.bip_user);
    var userId = user.userId;
    var userName = user.userName;
    var storeId = user.store.storeId;
    var param = {customerId:customerId,userId:userId,userName:userName,storeId:storeId,principalId:principalId,principal:principal,holderId:holderId};
    insuranceService.confirmIntoStore(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

//根据多条件查询潜客
router.post('/findCustByCondition', function(req, res, next) {
    var param = req.body.searchDatas;
    var user = JSON.parse(req.cookies.bip_user);
    var roleId=user.role.roleId;
    insuranceService.findCustByCondition(param,roleId)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

//审批单打印
router.post('/print_spd', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    var param = JSON.parse(req.body.print_spd_datas);
    var flag = req.body.flag;
    param.approvalBill.fourSStoreId = storeId;
    insuranceService.print_spd(JSON.stringify(param),flag)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

//根据车架号查询审批单
router.get('/findInfofromApprovalBill', function(req, res, next) {
    var chassisNumber = req.query.chassisNumber;
    insuranceService.findInfofromApprovalBill(chassisNumber)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});


//更新保单信息
router.post('/updateInsuranceBillInfo', function(req, res, next) {
    var insuranceBill = req.body.insuranceBill;
    var insuTypes = req.body.insuTypes;
    var param = {insuranceBill:insuranceBill,insuTypes:insuTypes};
    insuranceService.updateInsuranceBillInfo(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

//多条件查询审批单
router.post('/findApprovalBillByCondition', function(req, res, next) {
    var condition = req.body.condition;
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    var startNum = req.body.startNum;
    var shortSpd = req.body.short;
    var shortmainSpd = req.body.shortmain;
    var billFlag = req.body.billFlag;
    var roleId = user.role.roleId;
    var param = {condition:condition,storeId:storeId,startNum:startNum,billFlag:billFlag,roleId:roleId,shortSpd:shortSpd,shortmainSpd:shortmainSpd};
    insuranceService.findApprovalBillByCondition(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

//根据审批单的id查询审批单详情
router.post('/findByApprovalBillId', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    var approvalBillId = req.body.id;
    var billFlag = req.body.billFlag;
    var roleId = user.role.roleId;
    var param = {approvalBillId:approvalBillId,storeId:storeId,billFlag:billFlag,roleId:roleId};
    insuranceService.findByApprovalBillId(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});
//总经理删除保单
router.post('/deleteBill', function(req, res, next) {
    //var user = JSON.parse(req.cookies.bip_user);
    //var storeId = user.store.storeId;
    var insuranceBillId = req.body.insuranceBillId;
    var param = {insuranceBillId:insuranceBillId};
    insuranceService.deleteBill(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

//按车架号校验本月是否已出单
router.post('/findExistBillThisMonth', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    var chassisNumber = req.body.chassisNumber;
    var insurDate = req.body.insurDate;

    var param = {chassisNumber:chassisNumber,storeId:storeId,insurDate:insurDate};
    insuranceService.findExistBillThisMonth(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

//根据条件查询保单及统计保费总额度
router.post('/findInformationAndPremiumCount', function(req, res, next) {
    var user = JSON.parse(req.cookies.bip_user);
    var storeId = user.store.storeId;
    var condition = req.body.condition;

    var param = {condition:condition,storeId:storeId};
    insuranceService.findInformationAndPremiumCount(param)
        .then(function(result){
            res.json(result);
        })
        .catch(function(err){
            res.json(err);
        })
});

module.exports = router;
