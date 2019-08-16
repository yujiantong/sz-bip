/**
 * Created by qiumingyu on 2016/6/29.
 */
var pdf = require('../common/pdf');
var web = require('../common/configure').webConfigure;
var utilBsp = require('../common/utilBsp');
var logger = require('../common/logger').logger;


function  statisticalNewInsurance(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/performance/statisticalNewInsurance", param)
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


function  statisticalByRenewalType(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/performance/statisticalByRenewalType", param)
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
exports.statisticalNewInsurance = statisticalNewInsurance;
exports.statisticalByRenewalType = statisticalByRenewalType;