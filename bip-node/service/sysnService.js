/**
 * Created by qiumingyu on 2016/10/10.
 */
var web = require('../common/configure').webConfigure;
var utilBsp = require('../common/utilBsp');
var logger = require('../common/logger').logger;

//查询bsp同步过来的所有店
function  findBspStore(){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/sysn/findBspStore")
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

//将bsp的店绑定带bip的店中
function sysnBspStore(param){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/sysn/sysnBspStore",param)
            .then(function(result){
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    })
    return promise;
}

//删除bip店中绑定的bsp店
function delBangedBspStore(param){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/sysn/delBangedBspStore",param)
            .then(function(result){
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    })
    return promise;
}

//检查该店是否已经绑定过
function checkStoreIsBang(param){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/sysn/checkStoreIsBang",param)
            .then(function(result){
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    })
    return promise;
}

//绑定用户
function sysnBspUser(param){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/sysn/sysnBspUser",param)
            .then(function(result){
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    })
    return promise;
}

//解除绑定的用户
function delBangedBspUser(param){
    var promise = new Promise(function(resolve, reject){

        utilBsp.postToJava(web.bip, "/sysn/delBangedBspUser",param)
            .then(function(result){
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    })
    return promise;
}

//根据bip的店id查询所有的已经绑定好的用户
function findNoBangedUser(param){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/sysn/findNoBangedUser",param)
            .then(function(result){
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    })
    return promise;
}


//根据bip的店id查询所有的用户（前提是bip的店已经和bsp店绑定好了）
function findBipBspUser(param){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/sysn/findBipBspUser",param)
            .then(function(result){
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    })
    return promise;
}


//根据bip的店id查询所有的用户（前提是bip的店已经和bsp店绑定好了）
function findBipWork(param){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/sysn/findBipWork",param)
            .then(function(result){
                if(result.success){
                    resolve({status:web.success,results: result});
                }else{
                    resolve({status:web.fault,results: result});
                }
            })
            .catch(function (err) {
                reject(err);
            });
    })
    return promise;
}
exports.findBspStore = findBspStore;
exports.sysnBspStore = sysnBspStore;
exports.delBangedBspStore = delBangedBspStore;
exports.checkStoreIsBang = checkStoreIsBang;
exports.sysnBspUser = sysnBspUser;
exports.delBangedBspUser = delBangedBspUser;
exports.findNoBangedUser = findNoBangedUser;
exports.findBipBspUser = findBipBspUser;
exports.findBipWork = findBipWork;
