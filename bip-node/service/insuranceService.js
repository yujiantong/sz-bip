/**
 * Created by qiumingyu on 2016/6/3.
 */
var pdf = require('../common/pdf');
var web = require('../common/configure').webConfigure;
var utilBsp = require('../common/utilBsp');
var logger = require('../common/logger').logger;



function  findDetail(id){
    var parm = {"_method":"SEARCH" ,id:id};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/insurance/findDetail", parm)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                } else {
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

function  findRecord(id){
    var parm = {"_method":"SEARCH" ,id:id};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/insurance/findRecord", parm)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                } else {
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}
//新增保单
function  addInsurance(body){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/insurance/addInsurance", body)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}
//按车架号查询信息
function  findTraceRecord(chassisNumber, storeId){
    var parm = {chassisNumber:chassisNumber,storeId:storeId};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/insurance/findTraceRecord", parm)
            .then(function (body) {
                resolve(body);
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

function  findByCovertypeAndCdrq(obj){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/insurance/findByCovertypeAndCdrq", obj)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,result:result});
                } else {
                    resolve({status:web.fault,result:result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//续保专员按投保类型查询保单
function  findRCInsuranceBill(obj){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/insurance/findRCInsuranceBill", obj)
            .then(function (body) {
                if(body.success){
                    resolve({status:web.success,result:body});
                }else{
                    resolve({status:web.fault,result:body});
                }

            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//销售或者服务顾问按投保类型查询保单
function  findSCOrSAInsuranceBill(obj,shortBd,shortmainBd){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/insurance/findSCOrSAInsuranceBill", obj)
            .then(function (body) {
                if(body.success){
                    resolve({status:web.success,result:body});
                }else{
                    resolve({status:web.fault,result:body});
                }

            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//服务经理按投保类型查询保单
function  findSeMInsuranceBill(obj){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/insurance/findSeMOrSaMInsuranceBill", obj)
            .then(function (body) {
                if(body.success){
                    resolve({status:web.success,result:body});
                }else{
                    resolve({status:web.fault,result:body});
                }

            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//销售经理按投保类型查询保单
function  findSaMInsuranceBill(obj){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/insurance/findSeMOrSaMInsuranceBill", obj)
            .then(function (body) {
                if(body.success){
                    resolve({status:web.success,result:body});
                }else{
                    resolve({status:web.fault,result:body});
                }

            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//销售经理根据不同情况查询保单
function  findAllSaMInsuranceBill(obj){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/insurance/findAllSeMOrSaMInsuranceBill", obj)
            .then(function (body) {
                if(body.success){
                    resolve({status:web.success,result:body});
                }else{
                    resolve({status:web.fault,result:body});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//服务经理根据不同情况查询保单
function  findAllSeMInsuranceBill(obj){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/insurance/findAllSeMOrSaMInsuranceBill", obj)
            .then(function (body) {
                if(body.success){
                    resolve({status:web.success,result:body});
                }else{
                    resolve({status:web.fault,result:body});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

function  findByMoreCondition(obj){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/insurance/findByMoreCondition", obj)
            .then(function (body) {
                if(body.success){
                    resolve({status:web.success,result:body});
                }else{
                    resolve({status:web.fault,result:body});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}
//续保专员根据不同情况查询保单
function  findAllRCInsuranceBill(obj){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/insurance/findAllRCInsuranceBill", obj)
            .then(function (body) {
                if(body.success){
                    resolve({status:web.success,result:body});
                }else{
                    resolve({status:web.fault,result:body});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//服务或者销售顾问根据不同情况查询保单
function  findAllSCOrSAInsuranceBill(obj,shortBd,shortmainBd){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/insurance/findAllSCOrSAInsuranceBill?shortBd="+shortBd+"&shortmainBd="+shortmainBd, obj)
            .then(function (body) {
                if(body.success){
                    resolve({status:web.success,result:body});
                }else{
                    resolve({status:web.fault,result:body});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//确认邀约到店
function  confirmIntoStore(obj){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/insurance/confirmIntoStore", obj)
            .then(function (body) {
                if(body.success){
                    resolve({status:web.success,result:body});
                }else{
                    resolve({status:web.fault,result:body});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//根据多条件查询潜客
function  findCustByCondition(obj,roleId){
    var parm = {condition:obj};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/insurance/findCustByCondition?roleId="+roleId, parm )
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,result:result});
                } else {
                    resolve({status:web.fault,result:result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//审批单打印
function  print_spd(print_spd_datas,flag){
    var param = {print_spd_datas:print_spd_datas};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/insurance/print_spd", param)
            .then(function (body) {
                if(flag==1){
                    pdf.get_spd(JSON.parse(print_spd_datas),function(){
                        resolve({status:web.success,result:'OK'});
                    });
                }else if(flag==2){
                    pdf.getSpdNew(JSON.parse(print_spd_datas),function(){
                        resolve({status:web.success,result:'OK'});
                    });
                }

            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//根据车架号查询审批单
function  findInfofromApprovalBill(chassisNumber){
    var parm = {chassisNumber:chassisNumber};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/insurance/findInfofromApprovalBill", parm)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,result:result});
                } else {
                    resolve({status:web.fault,result:result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//更新保单信息
function updateInsuranceBillInfo(obj){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/insurance/updateInsuranceBillInfo", obj)
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

//新增历史保单
function saveOldInsurance(obj){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/insurance/saveOldInsurance", obj)
            .then(function (result) {
                if (result.success) {
                    resolve({status: web.success, results: result});
                } else {
                    resolve({status: web.fault, results: result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//多条件查询审批单
function findApprovalBillByCondition(obj){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/insurance/findByCondition", obj)
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

function findByApprovalBillId(obj){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/insurance/findByApprovalBillId", obj)
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

function deleteBill(obj){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/insurance/deleteBill", obj)
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

//按车架号校验本月是否已出单
function findExistBillThisMonth(obj){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/insurance/findExistBillThisMonth", obj)
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

//根据条件查询保单及统计保费总额度
function findInformationAndPremiumCount(obj){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/insurance/findInformationAndPremiumCount", obj)
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

exports.findDetail  = findDetail;
exports.findRecord  = findRecord;
exports.findRCInsuranceBill = findRCInsuranceBill;
exports.findByCovertypeAndCdrq = findByCovertypeAndCdrq;
exports.findByMoreCondition = findByMoreCondition;
exports.findAllRCInsuranceBill = findAllRCInsuranceBill;
exports.addInsurance  = addInsurance;
exports.findTraceRecord  = findTraceRecord;
exports.confirmIntoStore = confirmIntoStore;
exports.findCustByCondition = findCustByCondition;
exports.print_spd  = print_spd;
exports.findInfofromApprovalBill = findInfofromApprovalBill;
exports.updateInsuranceBillInfo = updateInsuranceBillInfo;
exports.findSCOrSAInsuranceBill = findSCOrSAInsuranceBill;
exports.findAllSCOrSAInsuranceBill = findAllSCOrSAInsuranceBill;
exports.findSeMInsuranceBill = findSeMInsuranceBill;
exports.findSaMInsuranceBill = findSaMInsuranceBill;
exports.findAllSeMInsuranceBill = findAllSeMInsuranceBill;
exports.findAllSaMInsuranceBill = findAllSaMInsuranceBill;
exports.saveOldInsurance = saveOldInsurance;
exports.findApprovalBillByCondition = findApprovalBillByCondition;
exports.findByApprovalBillId = findByApprovalBillId;
exports.deleteBill = deleteBill;
exports.findExistBillThisMonth = findExistBillThisMonth;
exports.findInformationAndPremiumCount = findInformationAndPremiumCount;