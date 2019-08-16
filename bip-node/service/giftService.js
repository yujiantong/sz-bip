var web = require('../common/configure').webConfigure;
var utilBsp = require('../common/utilBsp');
var logger = require('../common/logger').logger;
var pdf = require('../common/pdf');

//新增赠品
function addGift(giftInfo){
    var param = {giftInfo:giftInfo};

    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/gift/addGift", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//根据赠品类型等条件查询赠品
function findGiftByCondition(param){

    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/gift/findGiftByCondition", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//根据赠品类型等条件查询赠品
function findGiftByCode(param){

    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/gift/findGiftByCode", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//修改赠品
function updateGiftByCode(giftInfo){
    var param = {giftInfo:giftInfo};

    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/gift/updateGiftById", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//根据赠品编码或者名称自动联想查询赠品
function findGiftByCodeOrName(param){

    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/gift/findGiftByCodeOrName", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//操作赠品生效或者不生效
function updateGiftStaus(param){

    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/gift/updateGiftStaus", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//根据条件查询赠送信息相关联的保单信息
function findGivingByCondition(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/giving/findGivingByCondition", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//根据审批单ID查询赠送信息
function findGivingByApprovalBillId(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/giving/findGivingByApprovalBillId", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}
// 导出赠品信息 exportGiftRecord
function givingExportGiftRecord(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/giving/exportGiftRecord", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//修改赠送信息
function updateGiving(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/giving/updateGiving", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//打印核销单
function printHxd(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/insurance/findByApprovalBillId", param)
            .then(function (result) {
                var hxdData = result.content.result;
                if(result.success){
                    pdf.getHxd(hxdData,function(){
                        resolve({status:web.success});
                    });
                }else{
                    resolve({status:web.fault});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}



//根据审批单ID查询核销记录
function findAllHxRecordByApprovalBillId(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/giving/findAllHxRecordByApprovalBillId", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

exports.addGift = addGift;
exports.findGiftByCondition = findGiftByCondition;
exports.findGiftByCode = findGiftByCode;
exports.updateGiftByCode = updateGiftByCode;
exports.findGiftByCodeOrName = findGiftByCodeOrName;
exports.updateGiftStaus = updateGiftStaus;
exports.findGivingByCondition = findGivingByCondition;
exports.givingExportGiftRecord = givingExportGiftRecord;
exports.findGivingByApprovalBillId = findGivingByApprovalBillId;
exports.updateGiving = updateGiving;
exports.printHxd = printHxd;
exports.findAllHxRecordByApprovalBillId=findAllHxRecordByApprovalBillId;

