var web = require('../common/configure').webConfigure;
var utilBsp = require('../common/utilBsp');
var logger = require('../common/logger').logger;

//新增厂家
function  insert(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/vender/insert", param)
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
//修改厂家
function  update(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/vender/update",param)
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
//按条件查询厂家
function  findVenderByCondition(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/vender/findVenderByCondition", param)
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
exports.update = update;
exports.findVenderByCondition = findVenderByCondition;
