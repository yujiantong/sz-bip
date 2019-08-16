var web = require('../common/configure').webConfigure;
var utilBsp = require('../common/utilBsp');
var logger = require('../common/logger').logger;

//新增极光推送用户信息
function addJpush(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/jpush/addJpush", param)
            .then(function (result) {
                if(result.success){
                    resolve({status:web.success,results:result});
                }else{
                    resolve({status:web.fault,results:result});
                }
            })
            .catch(function (err) {
                reject(err);
                logger.error(err);
            });
    });
    return promise;
}

exports.addJpush = addJpush;
