var web = require('../common/configure').webConfigure;
var utilBsp = require('../common/utilBsp');
var logger = require('../common/logger').logger;
var io = require('../app');

function createResponseEvent(socketName) {
    return new Promise(function (resolve, reject) {

        var socket = io.onlineUsers[socketName].socket;
        socket.on('response', function (data) {
            resolve({data:data});

        });
    });

}

function sendMessage(storeId,userId,userName,customerId,contact,phone,content,principalId,principal,nicheng,sendWay){

    var param = {storeId:storeId,userId:userId,userName:userName,customerId:customerId,contact:contact,
        contactWay:phone,content:content,principalId:principalId,principal:principal,nicheng:nicheng};

    var promise = new Promise(function (resolve, reject) {
        var socketName;
        if(sendWay==2){
            socketName = storeId+'_0';
        }else if(sendWay==1){
            socketName = storeId+'_'+userId;
        }
        if(io.onlineUsers[socketName]){
            var socket = io.onlineUsers[socketName].socket;
            socket.emit('message', {data:param});
            createResponseEvent(socketName).then(function(result1){
                if(result1.data.success){
                    utilBsp.postToJava(web.bip, "/message/addPhoneMessage",param)
                        .then(function (result) {
                            if(result.success){
                                resolve({status:web.success,results:result});
                            }else{
                                resolve({status:web.fault,results:result});
                            }
                        })
                        .catch(function (err) {
                            logger.err(err);
                            reject(err);
                        });
                }else{
                    resolve({status:web.fault,results: {message:"发送短信失败，请重发"}});
                }
            })
        }else{
            resolve({status:web.fault,results: {message:"请检查发送短信的手机是否登录APP"}});
        }
    });

    return promise;
}

/**
 * 查询发送过的短信
 * param: storeId,currentPage
 */
function findPhoneMessage(obj){
    var promise = new Promise(function(resolve, reject){
        utilBsp.postToJava(web.bip, "/message/findPhoneMessage", obj)
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

exports.sendMessage  = sendMessage;
exports.findPhoneMessage = findPhoneMessage;