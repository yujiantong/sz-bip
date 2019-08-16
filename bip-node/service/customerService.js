/**
 * Created by qiumingyu on 2016/6/3.
 */
var web = require('../common/configure').webConfigure;
var utilBsp = require('../common/utilBsp');
var logger = require('../common/logger').logger



//根据跟踪状态查询
function  findByTraceStatu(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/findByTraceStatu", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//根据潜客脱保状态查询
function  findByCusLostInsurStatu(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/findByCusLostInsurStatu", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//根据接收状态查询
function  findByAcceptStatu(param){

    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/findByAcceptStatu", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}
//根据回退状态查询
function  findByReturnStatu(param){

    var promise = new Promise(function (resolve, reject) {
            utilBsp.postToJava(web.bip, "/customer/findByReturnStatu", param)
                .then(function (result) {
                    if(result.success){
                        resolve({status:web.success,results: result});
                    }else{
                        resolve({status:web.fault,results: result});
                    }
                })
                .catch(function (err) {
                    reject(err);
                });
    });
    return promise;
}


//根据审批状态查询
function  findByApproval(param){

    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/findByApproval", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//根据邀约状态查询
function  findByInviteStatu(param){

    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/findByInviteStatu", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//根据查询字段条件查询
function  findByCondition(searchDatas ,userId,roleId,storeId){
    var parm = {"_method":"SEARCH" ,searchDatas:searchDatas,userId:userId,roleId:roleId,storeId:storeId };
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/findByCondition", parm)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}


//续保专员跟踪处理回退
function  traceReturn(customerId,userId,superiorId,userName,returnReason,storeId,principalId,principal,htyyxz,applyStatu){
    var parm = {"_method":"UPDATE", userId:userId, customerId:customerId,superiorId:superiorId,
        returnReason:returnReason,userName:userName,storeId:storeId,principalId:principalId,principal:principal,
        htyyxz:htyyxz,applyStatu:applyStatu};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/traceReturn", parm)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}


//续保专员跟踪删除邀约
function  deleteInvite(customerTraceId,userId,deleteInvietReason,userName,customerId,principalId,principal){
    var parm = {"_method":"UPDATE", userId:userId, customerTraceId:customerTraceId,deleteInvietReason:deleteInvietReason,
        userName:userName,customerId:customerId,principalId:principalId,principal:principal};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/deleteInvite", parm)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                logger.error(err);

                reject(err);
            });
    });
    return promise;
}

//根据查潜客Id查询潜客信息和跟踪信息
function  findByCustomerId(customerId,roleId){
    var parm = {"_method":"POST", customerId:customerId,roleId:roleId};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/renewalingCustomer/findByCustomerId", parm)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                logger.error(err);

                reject(err);
            });
    });
    return promise;
}
//根据潜客的级别自动带出下次跟踪日期
function setNextTraceDay(obj){
    var promise = new Promise(function(resolve,reject){
        utilBsp.postToJava(web.bip, "/customer/setNextTraceDay", obj)
            .then(function(result){
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

//添加潜客跟踪记录
function  addTraceRecord(obj){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/addTraceRecord", obj)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//新增潜客
function  addCustomer(body,storeId,userId,userName,roleId,generateCustomerFlag){
    var promise = new Promise(function (resolve, reject) {
        var param = {"_method":"POST", customerInfo:body,storeId:storeId,
            userId:userId,userName:userName,roleId:roleId,generateCustomerFlag:generateCustomerFlag};
        utilBsp.postToJava(web.bip, "/customer/addCustomer", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}
//更新接受状态
function  updateAcceptStatu(customerId,userId,userName,principalId,principal){
    var promise = new Promise(function (resolve, reject) {
        var param = {"_method":"POST", customerId:customerId,userId:userId,userName:userName,principalId:principalId,principal:principal};

        utilBsp.postToJava(web.bip, "/customer/updateAcceptStatu", param)
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

////更新接受状态
//function  updateCseAcceptStatu(customerId,userId,userName){
//    var promise = new Promise(function (resolve, reject) {
//        var param = {"_method":"POST", customerId:customerId,userId:userId,userName:userName};
//
//        utilBsp.postToJava(web.bip, "/customer/updateCseAcceptStatu", param)
//            .then(function (result) {
//                if(result.success){
//                    resolve({status:web.success,results:result});
//                }else{
//                    resolve({status:web.fault,results:result});
//                }
//            })
//            .catch(function (err) {
//                logger.error(err);
//                reject(err);
//            });
//    });
//    return promise;
//}


//销售,服务等顾问的接受处理
//function  updateConsultantAcceptStatu(customerId,userId,userName){
//    var promise = new Promise(function (resolve, reject) {
//        var param = {"_method":"POST", customerId:customerId,userId:userId,userName:userName};
//
//        utilBsp.postToJava(web.bip, "/customer/updateConsultantAcceptStatu", param)
//            .then(function (result) {
//                if(result.success){
//                    resolve({status:web.success,results:result});
//                }else{
//                    resolve({status:web.fault,results:result});
//                }
//            })
//            .catch(function (err) {
//                logger.error(err);
//                reject(err);
//            });
//    });
//    return promise;
//}

//更换接收人时,更新当前分配人的信息
function  changePrincipal(obj){
    var promise = new Promise(function (resolve, reject) {

        utilBsp.postToJava(web.bip, "/customer/changePrincipal", obj)
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

//销售,服务等经理更换接收人
function  managerChangePrincipal(obj){
    var promise = new Promise(function (resolve, reject) {

        utilBsp.postToJava(web.bip, "/customer/managerChangePrincipal", obj)
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

//续保主管跟踪回退处理
function  traceReturnXbzg(customerId,userId,storeId,principalId,principal,userName,returnReason){
    var promise = new Promise(function (resolve, reject) {
        var param = {"_method":"POST", customerId:customerId,userId:userId,storeId:storeId,
            principalId:principalId,principal: principal,userName:userName,returnReason:returnReason};

        utilBsp.postToJava(web.bip, "/customer/traceReturnXbzg", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//跟踪完成处理
function  traceFinishHandle(obj){
    var promise = new Promise(function (resolve, reject) {

        utilBsp.postToJava(web.bip, "/customer/traceFinishHandle", obj)
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


//销售顾问回退
function  returnBySC(customerId,userId,userName,superiorId,returnReason,storeId,principalId,principal){
    var promise = new Promise(function (resolve, reject) {
        var param = {"_method":"POST", customerId:customerId,userId:userId,userName:userName,
            superiorId:superiorId,returnReason:returnReason,storeId:storeId,principalId:principalId,
            principal:principal};

        utilBsp.postToJava(web.bip, "/customer/returnBySC", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//销售经理回退
function  returnBySCM(customerId,userId,userName,clerkId,returnReason,storeId,principalId,principal){
    var promise = new Promise(function (resolve, reject) {
        var param = {"_method":"POST", customerId:customerId,userId:userId,userName:userName,
            clerkId:clerkId,returnReason:returnReason,storeId:storeId,principalId:principalId,principal:principal};

        utilBsp.postToJava(web.bip, "/customer/returnBySCM", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//服务顾问回退
function  returnByFwgw(customerId,userId,userName,superiorId,returnReason,storeId,principalId,principal){
    var promise = new Promise(function (resolve, reject) {
        var param = {"_method":"POST", customerId:customerId,userId:userId,userName:userName,
            superiorId:superiorId,returnReason:returnReason,storeId:storeId,
            principalId:principalId,principal:principal};

        utilBsp.postToJava(web.bip, "/customer/returnByFwgw", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//服务经理回退
function  returnByFwgwM(customerId,userId,userName,clerkId,returnReason,storeId,principalId,principal){
    var promise = new Promise(function (resolve, reject) {
        var param = {"_method":"POST", customerId:customerId,userId:userId,userName:userName,
            clerkId:clerkId,returnReason:returnReason,storeId:storeId,principalId:principalId,
            principal:principal};

        utilBsp.postToJava(web.bip, "/customer/returnByFwgwM", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//客服专员失销
function  lostSale(customerId,storeId,userId,superiorId,lostReason,userName,principalId,principal,sxyyxz){
    var promise = new Promise(function (resolve, reject) {
        var param = {"_method":"POST", customerId:customerId,storeId:storeId,userId:userId,superiorId:superiorId,
            lostReason:lostReason,userName:userName,principalId:principalId,principal:principal,sxyyxz:sxyyxz};

        utilBsp.postToJava(web.bip, "/customer/lostSale", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}


//激活
function  wakeUpCustomer(customerId,userId,principalId,principal,wakeReason,userName,storeId,loginRoleId){
    var promise = new Promise(function (resolve, reject) {
        var param = {"_method":"POST", customerId:customerId,userId:userId,principalId:principalId,principal:principal,
            wakeReason:wakeReason,userName:userName,storeId:storeId,loginRoleId:loginRoleId};

        utilBsp.postToJava(web.bip, "/customer/wakeUpCustomer", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//延期申请操作,更新回退状态为待延期状态
function  updateReturnStatuToDyq(obj){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/updateReturnStatuToDyq", obj)
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


//延期审批时,更新回退状态为已延期(Yyq)状态,更新延期到期日为当前时间加 7天
function  updateReturnStatuToYyq(obj){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/updateReturnStatuToYyq", obj)
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

//续保主管直接点击延期
function  updateReturnStatuByRD(obj){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/updateReturnStatuByRD", obj)
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

//续保专员更新接受状态(批量)
function  updateAcceptStatuBatch(customerInfo,userName){
    var promise = new Promise(function (resolve, reject) {
        var param = {"_method":"POST", customerInfo:customerInfo, userName:userName};

        utilBsp.postToJava(web.bip, "/customer/updateAcceptStatuBatch", param)
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

//续保主管不同意回退
function  unAgreeTraceReturnXbzg(obj){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/unAgreeTraceReturnXbzg", obj)
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

//客服专员更新接受状态(批量)
function  updateCseAcceptStatuBatch(customerInfo,userName){
    var promise = new Promise(function (resolve, reject) {
        var param = {"_method":"POST", customerInfo:customerInfo, userName:userName};

        utilBsp.postToJava(web.bip, "/customer/updateCseAcceptStatuBatch", param)
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

//销售经理不同意回退
function  unAgreeReturnBySCM(obj){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/unAgreeReturnBySCM", obj)
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


//销售,服务等顾问的接受处理(批量)
function  updateConsultantAcceptStatuBatch(customerInfo,userName){
    var promise = new Promise(function (resolve, reject) {
        var param = {"_method":"POST", customerInfo:customerInfo, userName:userName};

        utilBsp.postToJava(web.bip, "/customer/updateConsultantAcceptStatuBatch", param)
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


//延期审批拒绝
function  updateReturnStatuToCszt(obj){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/updateReturnStatuToCszt", obj)
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

//服务经理不同意回退
function  unAgreeReturnByFwgwM(obj){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/unAgreeReturnByFwgwM", obj)
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

//更新潜客信息
function  updateCustomerInfo(obj){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/updateCustomerInfo", obj)
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

//新增报价信息
function  addCustomerBJRecode(customerBJRecode,userId,userName,storeId){
    var promise = new Promise(function (resolve, reject) {
        var param = {"_method":"POST", customerBJRecode:customerBJRecode,userId:userId,userName:userName,storeId:storeId};
        utilBsp.postToJava(web.bip, "/customer/addCustomerBJRecode", param)
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

//按潜客ID查询该潜客所有的报价信息
function  findListCustomerBJRecode(customerId){
    var promise = new Promise(function (resolve, reject) {
        var param = {"_method":"POST", customerId:customerId};
        utilBsp.postToJava(web.bip, "/customer/findListCustomerBJRecode", param)
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
//查询潜客审批单记录
function  findApprovalBillRecordList(chassisNumber,fourSStoreId){
    var promise = new Promise(function (resolve, reject) {
        var param = {"_method":"POST", chassisNumber:chassisNumber,fourSStoreId:fourSStoreId};
        utilBsp.postToJava(web.bip, "/customer/findApprovalBillRecordList", param)
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
//客服专员唤醒潜客
function  activateCustomer(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/activateCustomer", param)
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
//客服专员睡眠潜客
function customerSleep(obj){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/saveCustomerSleep", obj)
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
//续保主管睡眠潜客
function customerSleepByRD(obj){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/saveCustomerSleepByRD", obj)
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
//查询已经唤醒的潜客
function  findActivateCustomer(param){

    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/findActivateCustomer", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//指定接收人时,更新当前分配人的信息
function  assignPrincipal(obj){
    var promise = new Promise(function (resolve, reject) {

        utilBsp.postToJava(web.bip, "/customer/assignPrincipal", obj)
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

//查询bsp战败从而转到bip的潜客
function  findDefeatCustomer(obj){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/findDefeatCustomer", obj)
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

//战败潜客
function  saveDefeatCustomer(obj){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/saveDefeatCustomer", obj)
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

//主动回退service
function  activeReturn(obj){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/activeReturn", obj)
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

//根据跟踪状态查询潜客跟踪记录
function  findByTraceStatuGzjl(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/renewalingCustomer/findByTraceStatuGzjl", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//按潜客的潜客脱保状态条件查询潜客跟踪记录
function  findByCusLostInsurStatuGzjl(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/renewalingCustomer/findByCusLostInsurStatuGzjl", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//按接受状态查询潜客跟踪记录
function  findByAcceptStatuGzjl(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/renewalingCustomer/findByAcceptStatuGzjl", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//按回退状态查询潜客
function  findByReturnStatuGzjl(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/renewalingCustomer/findByReturnStatuGzjl", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}
//按邀约状态查询潜客跟踪记录
function  findByInviteStatuGzjl(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/renewalingCustomer/findByInviteStatuGzjl", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//按待审批查询潜客跟踪记录
function  findByApprovalGzjl(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/renewalingCustomer/findByApprovalGzjl", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//多条件查询潜客跟踪记录（基盘是大池子包括未分配的潜客，一般用于续保主管，保险经理，总经理，等需要看到所有潜客的用户）
function  findCustByConditionGzjl(obj){
    var parm = {condition:obj};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/renewalingCustomer/findCustByConditionGzjl", parm)
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

//查询已经唤醒的潜客跟踪记录
function findActivateCustomerGzjl(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/renewalingCustomer/findActivateCustomerGzjl", param)
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

//手动请求壁虎刷新潜客信息，修改潜客
function  manual(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/manual", param)
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

//手动请求壁虎刷新潜客信息，新增潜客
function  newCover(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/newCover", param)
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

//查询邀约记录
function  findInviteStatuRC(param){

    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/findInviteRecord", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//查询邀约记录
function  findInviteStatuRD(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/findInviteRecord", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//续保主管批量换人
function  changePrincipalBatchRD(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/updateChangePrincipalBatch", param)
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

//服务经理或者销售经理批量换人
function  changePrincipalBatchSM(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/updateChangePrincipalBatch", param)
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

//根据建档人id查询潜客
function  findCustomerByCreater(param){

    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/findCustomerByCreater", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//验证车架号是否重复
function  yzChaNum(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/yzChaNum", param)
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



function  getMessage(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/getMessage", param)
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
//获取用户的壁虎保险信息
function  findBxInfoForBH(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/findBxInfoForBH", param)
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

//已激活查询潜客
function  findByJiHuo(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/findByJiHuo", param)
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

//查询到店未出单潜客
function  findDdwcdCus(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/findDdwcdCus", param)
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

//前台主管按不同状态查询潜客
function findByStatusQtzg(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/findByStatusQtzg", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//前台主管的潜客查询
function findByConditionQtzg(searchDatas,storeId){
    var parm = {searchDatas:searchDatas,storeId:storeId };
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/findByConditionQtzg", parm)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//前台主管的潜客查询
function ceshi(parm){
    console.log(parm);
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/ceshi", {parm:parm})
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    });
    return promise;
}

//销售经理/服务经理主动回退
function  returnByXSJLZD(customerId,userId,userName,clerkId,returnReason,storeId,principalId,principal){
    var promise = new Promise(function (resolve, reject) {
        var param = {"_method":"POST", customerId:customerId,userId:userId,userName:userName,
            clerkId:clerkId,returnReason:returnReason,storeId:storeId,principalId:principalId,principal:principal};

        utilBsp.postToJava(web.bip, "/customer/returnByXSJLZD", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                logger.error(err);
                reject(err);
            });
    });
    return promise;
}

//查询已回退潜客记录数
function  findByYiHuiTui(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/renewalingCustomer/findByYiHuiTui", param)
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

//取消睡眠
function saveCancelSleep(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/saveCancelSleep", param)
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
//根据customerId和dcbjrq查询报价信息
function  findBJListByCustomerId(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/findBJListByCustomerId", param)
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

//根据customerId查询潜客跟踪次数
function findGzCount(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/findGzCount", param)
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

function  getMessageByUC(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/getMessageByUC", param)
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
//批量睡眠
function  sleepBatchXBZG(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/sleepBatchXBZG", param)
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

//批量失销
function  batchLostSale(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/batchLostSale", param)
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

//根据线索id查询线索
function findDefeatedSourceById(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/findDefeatedSourceById", param)
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

//续保主管失销
function lostByXbzg(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/lostByXbzg", param)
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

//续保专员撤销回退，失销，睡眠
function cancelReturn(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/customer/cancelReturn", param)
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

exports.findGzCount =findGzCount;
exports.saveCancelSleep = saveCancelSleep;
exports.findByStatusQtzg = findByStatusQtzg;
exports.findByConditionQtzg = findByConditionQtzg;
exports.findInviteStatuRC = findInviteStatuRC;
exports.findInviteStatuRD = findInviteStatuRD;
exports.findByTraceStatu  = findByTraceStatu;
exports.findByCusLostInsurStatu  = findByCusLostInsurStatu;
exports.findByAcceptStatu = findByAcceptStatu;
exports.findByReturnStatu = findByReturnStatu;
exports.findByInviteStatu  = findByInviteStatu;
exports.findByCondition  = findByCondition;
exports.traceReturn  = traceReturn;
exports.deleteInvite  = deleteInvite;
exports.findByCustomerId  = findByCustomerId;
exports.addCustomer  = addCustomer;
exports.addTraceRecord  = addTraceRecord;
exports.updateAcceptStatu = updateAcceptStatu;
exports.changePrincipal = changePrincipal;
exports.traceReturnXbzg = traceReturnXbzg;
exports.traceFinishHandle = traceFinishHandle;
exports.returnBySC = returnBySC;
exports.returnBySCM = returnBySCM;
exports.returnByFwgw = returnByFwgw;
exports.returnByFwgwM = returnByFwgwM;
exports.lostSale = lostSale;
exports.wakeUpCustomer = wakeUpCustomer;
exports.managerChangePrincipal = managerChangePrincipal;
exports.returnBySCM = returnBySCM;
//exports.updateConsultantAcceptStatu = updateConsultantAcceptStatu;
//exports.updateCseAcceptStatu = updateCseAcceptStatu;
exports.updateReturnStatuToDyq = updateReturnStatuToDyq;
exports.updateReturnStatuToYyq = updateReturnStatuToYyq;
exports.updateAcceptStatuBatch = updateAcceptStatuBatch;
exports.updateCseAcceptStatuBatch = updateCseAcceptStatuBatch;
exports.updateConsultantAcceptStatuBatch = updateConsultantAcceptStatuBatch;
exports.updateReturnStatuToCszt = updateReturnStatuToCszt;
exports.unAgreeTraceReturnXbzg = unAgreeTraceReturnXbzg;
exports.unAgreeReturnBySCM = unAgreeReturnBySCM;
exports.unAgreeReturnByFwgwM = unAgreeReturnByFwgwM;
exports.updateReturnStatuToCszt = updateReturnStatuToCszt;
exports.findByApproval = findByApproval;
exports.updateCustomerInfo = updateCustomerInfo;
exports.setNextTraceDay = setNextTraceDay;
exports.updateReturnStatuByRD = updateReturnStatuByRD;
exports.findListCustomerBJRecode = findListCustomerBJRecode;
exports.findApprovalBillRecordList = findApprovalBillRecordList;
exports.addCustomerBJRecode = addCustomerBJRecode;
exports.activateCustomer = activateCustomer;
exports.findActivateCustomer = findActivateCustomer;
exports.assignPrincipal = assignPrincipal;
exports.customerSleep = customerSleep;
exports.customerSleepByRD = customerSleepByRD;
exports.findDefeatCustomer = findDefeatCustomer;
exports.saveDefeatCustomer = saveDefeatCustomer;
exports.activeReturn = activeReturn;
exports.findByTraceStatuGzjl = findByTraceStatuGzjl;
exports.findByCusLostInsurStatuGzjl = findByCusLostInsurStatuGzjl;
exports.findByAcceptStatuGzjl = findByAcceptStatuGzjl;
exports.findByReturnStatuGzjl = findByReturnStatuGzjl;
exports.findByInviteStatuGzjl = findByInviteStatuGzjl;
exports.findByApprovalGzjl = findByApprovalGzjl;
exports.findCustByConditionGzjl = findCustByConditionGzjl;
exports.manual = manual;
exports.newCover = newCover;
exports.changePrincipalBatchRD = changePrincipalBatchRD;
exports.changePrincipalBatchSM = changePrincipalBatchSM;
exports.findCustomerByCreater = findCustomerByCreater;
exports.yzChaNum = yzChaNum;
exports.getMessage =getMessage;
exports.findBxInfoForBH = findBxInfoForBH;
exports.findByJiHuo = findByJiHuo;
exports.findDdwcdCus = findDdwcdCus;
exports.findActivateCustomerGzjl =findActivateCustomerGzjl;
exports.ceshi = ceshi;
exports.returnByXSJLZD = returnByXSJLZD;
exports.findByYiHuiTui = findByYiHuiTui;
exports.findBJListByCustomerId = findBJListByCustomerId;
exports.getMessageByUC = getMessageByUC;
exports.sleepBatchXBZG = sleepBatchXBZG;
exports.batchLostSale = batchLostSale;
exports.findDefeatedSourceById = findDefeatedSourceById;
exports.lostByXbzg = lostByXbzg;
exports.cancelReturn = cancelReturn;
