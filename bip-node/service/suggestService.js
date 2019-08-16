var web = require('../common/configure').webConfigure;
var utilBsp = require('../common/utilBsp');
var logger = require('../common/logger').logger;

//新增建议
function  addSuggest(suggestInfo){
    var param = {"_method":"INSERT" ,suggestInfo:suggestInfo};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/suggest/addSuggest", param)
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
//查询所有建议
function  selectAllSuggest(searchDatas,start,roleId){
    var param = {"_method":"SELECT" ,searchDatas:searchDatas,start:start,roleId:roleId};
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/suggest/selectAllSuggest",param)
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
//解决建议
function  solveSuggest(param,userId,userName){
    var param = {"_method":"UPDATE",param:param,userId:userId,userName:userName };
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/suggest/solveSuggest", param)
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
//按照建议人ID查询建议
function  findAllSuggestByUserId(param){
    var promise = new Promise(function (resolve, reject) {
        utilBsp.postToJava(web.bip, "/suggest/findAllSuggestByUserId", param)
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

exports.addSuggest = addSuggest;
exports.selectAllSuggest = selectAllSuggest;
exports.solveSuggest = solveSuggest;
exports.findAllSuggestByUserId = findAllSuggestByUserId;
