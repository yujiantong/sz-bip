var web = require('../common/configure').webConfigure;
var utilBsp = require('../common/utilBsp');
var logger = require('../common/logger').logger;

/**
 * 查询待回退员工列表
 * param: storeId
 */
function findDHTWorkCollection(obj){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/mobile/findDHTWorkCollection", obj)
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
    })
    return promise;
}


/**
 *根据customerId查询该潜客详情
 * params: customerId
 */
function findCustomerDetailsByCustomerId(obj){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/renewalingCustomer/findByCustomerId", obj)
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
    })
    return promise;
}


/**
 * 根据4s店id查询保险公司信息
 * params: storeId
 */
function findCompInfoByStoreId(obj){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/setting/findCompInfoByStoreId", obj)
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
    })
    return promise;
}

/**
 * 按潜客ID查询该潜客去年险种信息
 * params: storeId
 */
function findBxInfoForBH(obj){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/customer/findBxInfoForBH", obj)
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
    })
    return promise;
}

//报价
function applyBJFromBofide(obj){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/bofideToBiHu/applyBJFromBofide",param)
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

//保存报价
function  saveBJ(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/bofideToBiHu/saveBJ",param)
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


/**
 * 根据潜客id查询该潜客的所有跟踪记录
 * param: customerId
 */
function findRecordByCustomerId(obj){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/mobile/findTraceRecordByCustomerId", obj)
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
    })
    return promise;
}



/**
 * 查询回退待审批对应员工的潜客列表
 * param: userId,returnStatu,currentPage
 */
function findReturnApprovalCustomer(obj){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/mobile/findReturnApprovalCustomer", obj)
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
    })
    return promise;
}


/**
 * 根据潜客id查询该潜客的所有报价记录
 * param: customerId
 */
function findBjRecordByCustomerId(obj){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/customer/findListCustomerBJRecode", obj)
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
    })
    return promise;
}

//查询未接受员工列表
function findWJSWorkCollection(obj){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/mobile/findWJSWorkCollection", obj)
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
    })
    return promise;
}

/**
 * 查询未接受对应员工的潜客列表
 * param: userId,currentPage
 */
function findWJSCustomer(obj){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/mobile/findWJSCustomer", obj)
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
    })
    return promise;
}

//查询应跟踪员工列表
function findYGZWorkCollection(obj){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/mobile/findYGZWorkCollection", obj)
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
    })
    return promise;
}

//查询今日邀约员工列表
function findJRYYWorkerCollection(obj){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/mobile/findJRYYWorkerCollection", obj)
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
    })
    return promise;
}
/**
 * 查询应跟踪对应员工的潜客列表
 * param: userId,currentPage
 */
function findYGZCustomer(obj){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/mobile/findYGZCustomer", obj)
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
    })
    return promise;
}


/**
 * 查询今日邀约对应员工的潜客列表
 * param: userId,currentPage
 */
function findJRYYCustomerCollectionByUserId(obj){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/mobile/findJRYYCustomerCollectionByUserId", obj)
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
    })
    return promise;
}

/**
 * 查询到店未出单员工列表
 *
 */
function findDDWCDWorkCollection(obj){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/mobile/findDDWCDWorkCollection",obj)
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
    })
    return promise;
}
/** 查询将脱保(或已脱保)员工列表
 * param: storeId,
 *        cusLostInsurStatu 潜客脱保状态
 */
function findTBWorkCollection(obj){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/mobile/findTBWorkCollection", obj)
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
    })
    return promise;
}

/**
 * 查询应跟踪对应员工的潜客列表
 * param: userId,currentPage
 */
function findDDWCDCustomer(obj){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/mobile/findDDWCDCustomer", obj)
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
    })
    return promise;
}


/**
 * 查询将脱保(或已脱保)对应员工的潜客列表
 * param: userId 用户id
 *        cusLostInsurStatu 潜客脱保状态
 *        currentPage 当前页数
 */
function findTBCustomer(obj){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/mobile/findTBCustomer", obj)
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
    })
    return promise;
}

/**
 *
 * 根据店ID查询用户
 *
 *
 */
function findUsersByStoreId(obj){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/mobile/findUsersByStoreId", obj)
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
    })
    return promise;
}

function findBillTodayCreate(obj){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/mobile/findBillTodayCreate", obj)
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
    })
    return promise;
}

/**
 * 查询已激活对应员工的潜客列表
 * param: userId,currentPage
 */
function findByJiHuo(obj){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/mobile/findByJiHuo", obj)
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
    })
    return promise;
}

/**
 * 查询已激活对应员工的潜客列表
 * param: currentPage...
 */
function findReturnDSPCustomer(obj){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/mobile/findReturnDSPCustomer", obj)
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
    })
    return promise;
}

/**
 * 可删除邀约
 * param: userId,currentPage
 */
function selectKSCYY(obj){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/mobile/selectKSCYY", obj)
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
    })
    return promise;
}

//APP的潜客查询
function findCustomerByConditionApp(obj){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/mobile/findCustomerByConditionApp", obj)
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
    })
    return promise;
}

//可删除邀约详情
function selectKSCYYXQ(obj){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/mobile/selectKSCYYXQ", obj)
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
    })
    return promise;
}

/*
 * 跟踪完成查询
 * params: userId, returnStatu, currentPage
 */
function findGZFinishedCustomer(obj){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/mobile/findGZFinishedCustomer", obj)
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
    })
    return promise;
}

//查询跟踪完成员工列表
function findGZWCWorkCollection(obj){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/mobile/findGZWCWorkCollection", obj)
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
    })
    return promise;
}

//查询已回退员工列表
function findYHTWorkCollection(obj){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/mobile/findYHTWorkCollection", obj)
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
    })
    return promise;
}

//查询战败线索员工列表
function findZBXSWorkCollection(obj){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/mobile/findZBXSWorkCollection", obj)
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
    })
    return promise;
}

//按用户id查询线索列表信息
function findDefeatedSourceByUserId(obj){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/mobile/findDefeatedSourceByUserId", obj)
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
    })
    return promise;
}

exports.findDHTWorkCollection = findDHTWorkCollection;
exports.findCustomerDetailsByCustomerId = findCustomerDetailsByCustomerId;
exports.findRecordByCustomerId = findRecordByCustomerId;
exports.findReturnApprovalCustomer = findReturnApprovalCustomer;
exports.findBjRecordByCustomerId = findBjRecordByCustomerId;
exports.findWJSWorkCollection = findWJSWorkCollection;
exports.findWJSCustomer = findWJSCustomer;
exports.findYGZWorkCollection = findYGZWorkCollection;
exports.findJRYYWorkerCollection = findJRYYWorkerCollection;
exports.findYGZCustomer = findYGZCustomer;
exports.findJRYYCustomerCollectionByUserId =findJRYYCustomerCollectionByUserId;
exports.findDDWCDWorkCollection = findDDWCDWorkCollection;
exports.findDDWCDCustomer = findDDWCDCustomer;
exports.findTBWorkCollection =findTBWorkCollection;
exports.findTBCustomer =findTBCustomer;
exports.findUsersByStoreId =findUsersByStoreId;
exports.findBillTodayCreate =findBillTodayCreate;
exports.findByJiHuo = findByJiHuo;
exports.findReturnDSPCustomer = findReturnDSPCustomer;
exports.findCustomerByConditionApp = findCustomerByConditionApp;
exports.selectKSCYY = selectKSCYY;
exports.selectKSCYYXQ = selectKSCYYXQ;
exports.findGZFinishedCustomer =findGZFinishedCustomer;
exports.findGZWCWorkCollection = findGZWCWorkCollection;
exports.findYHTWorkCollection = findYHTWorkCollection;
exports.findZBXSWorkCollection = findZBXSWorkCollection;
exports.findDefeatedSourceByUserId = findDefeatedSourceByUserId;
exports.findCompInfoByStoreId = findCompInfoByStoreId;
exports.findBxInfoForBH =findBxInfoForBH;
exports.applyBJFromBofide = applyBJFromBofide;
exports.saveBJ = saveBJ;
