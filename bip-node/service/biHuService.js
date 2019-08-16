/**
 * Created by qiumingyu on 2016/10/10.
 */
var web = require('../common/configure').webConfigure;
var utilBsp = require('../common/utilBsp');
var logger = require('../common/logger').logger;

//申请报价
function  applyBJ(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/bofideToBiHu/applyBJ",param)
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
 *用bofide提供的接口报价
 * @param param
 */
function  applyBJFromBofide(param){
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

/**
 * 调用博福接口获取车辆已投保信息
 * @param param
 */
function getCarInsuranceInfo(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/bofideToBiHu/getCarInsuranceInfo",param)
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

function  getModels(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/bofideToBiHu/getModels",param)
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
exports.applyBJ = applyBJ;
exports.saveBJ = saveBJ;
exports.applyBJFromBofide = applyBJFromBofide;
exports.getModels = getModels;
exports.getCarInsuranceInfo = getCarInsuranceInfo;