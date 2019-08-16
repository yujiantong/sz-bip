var web = require('../common/configure').webConfigure;
var utilBsp = require('../common/utilBsp');
var logger = require('../common/logger').logger;

//保险信息统计查询
function  findInsuranceStatistics(obj){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/statistic/findInsuranceStatistics",obj)
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

//售后信息统计查询
function  findServiceStatistics(obj){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/statistic/findServiceStatistics",obj)
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

//销售信息统计查询
function  findSaleStatistics(obj){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/statistic/findSaleStatistics",obj)
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

//续保专员的保险信息统计查询
function  findRCInsuranceStatistics(obj){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/statistic/findRCInsuranceStatistics",obj)
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

//服务顾问的售后信息统计查询
function  findSAServiceStatistics(obj){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/statistic/findSAServiceStatistics",obj)
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

//销售经理的销售信息统计查询
function  findSCSaleStatistics(obj){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/statistic/findSCSaleStatistics",obj)
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

//客服信息统计查询
function  findCSCStatistics(obj){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/statistic/findCSCStatistics",obj)
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

//客服专员的信息统计查询
function  findCSCUserStatistics(obj){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/statistic/findCSCUserStatistics",obj)
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

//出单员信息统计查询
function  findIWStatistics(obj){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/statistic/findIWStatistics",obj)
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
exports.findInsuranceStatistics  = findInsuranceStatistics;
exports.findServiceStatistics = findServiceStatistics;
exports.findSaleStatistics = findSaleStatistics;
exports.findRCInsuranceStatistics  = findRCInsuranceStatistics;
exports.findSAServiceStatistics = findSAServiceStatistics;
exports.findSCSaleStatistics = findSCSaleStatistics;
exports.findCSCStatistics = findCSCStatistics;
exports.findIWStatistics = findIWStatistics;
exports.findCSCUserStatistics = findCSCUserStatistics;