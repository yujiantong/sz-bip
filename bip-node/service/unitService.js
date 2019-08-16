var web = require('../common/configure').webConfigure;
var utilBsp = require('../common/utilBsp');
var logger = require('../common/logger').logger;

//新增事业部门
function  insert(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/unit/insert", param)
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

//按条件查询事业部门
function  findUnitByCondition(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/unit/findUnitByCondition", param)
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

//修改事业部门和店之间的关联
function  updateUnitAndStore(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/unit/updateUnitAndStore",param)
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

//根据不同条件查询4s店
function  findStore(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/unit/findStore",param)
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

exports.insert = insert;
exports.findUnitByCondition = findUnitByCondition;
exports.updateUnitAndStore = updateUnitAndStore;
exports.findStore = findStore;
