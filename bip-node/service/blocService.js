var web = require('../common/configure').webConfigure;
var utilBsp = require('../common/utilBsp');
var logger = require('../common/logger').logger;

//新增集团
function addBloc(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/bloc/addBloc", param)
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

//修改集团
function updateBloc(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/bloc/updateBloc",param)
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

//按条件查询集团
function findByCondition(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/bloc/findByCondition", param)
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

//删除集团
function deleteBloc(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/bloc/deleteBloc",param)
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

//按条件校验集团的信息是否存在
function findExistByCondition(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/bloc/findExistByCondition",param)
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
exports.addBloc = addBloc;
exports.updateBloc = updateBloc;
exports.findByCondition = findByCondition;
exports.deleteBloc = deleteBloc;
exports.findExistByCondition = findExistByCondition;